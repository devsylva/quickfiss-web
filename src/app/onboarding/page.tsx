"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface Slide {
  title: string;
  subtitle: string;
  image: string;
  imagePosition?: string;
}

const slides: Slide[] = [
  {
    title: "Find Trusted Artisans.",
    subtitle: "Search skilled and verified service providers for all your home repairs and maintenance needs.",
    image: "/images/slide-1.png",
    // The 4.8★ badge is baked into the photo near its right edge — bias the
    // crop right so narrower (desktop) frames don't clip it.
    imagePosition: "80% center",
  },
  {
    title: "Get Repairs Done Faster.",
    subtitle: "Book services instantly and get quick, reliable fixes at your convenience.",
    image: "/images/slide-2.png",
  },
  {
    title: "Review Your Experience.",
    subtitle: "Help others by rating providers and improving service quality for everyone.",
    image: "/images/slide-3.png",
  },
];

const SWIPE_THRESHOLD = 60;

export default function OnboardingPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const isFirst = index === 0;
  const slide = slides[index];

  const goNext = () => {
    if (isLast) {
      router.push("/sign-up");
      return;
    }
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (!isFirst) setIndex((i) => i - 1);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x >= SWIPE_THRESHOLD) goPrev();
  };

  return (
    // The chrome (blue panel, dots track, button) mounts once and never
    // unmounts between slides — only the image and copy swap, so the
    // transition reads as the app updating in place, not re-rendering the
    // whole screen.
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white lg:flex-row">
      <div className="relative h-[58%] shrink-0 lg:h-dvh lg:w-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: slide.imagePosition ?? "center" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* -mt-8 pulls the panel up over the image's bottom edge so the rounded
          corners reveal the image behind them instead of blank page background. */}
      <div className="relative z-10 -mt-8 flex flex-1 flex-col rounded-t-card bg-primary-dark pb-32 pt-7 text-white lg:mt-0 lg:h-dvh lg:w-1/2 lg:justify-center lg:rounded-none lg:pb-0 lg:pt-0">
        <div className="px-6 lg:mx-auto lg:w-full lg:max-w-md lg:px-20">
          <div className="mb-8 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className="py-2 pr-1.5 first:pl-0"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="cursor-grab touch-pan-y active:cursor-grabbing"
            >
              <h2 className="text-2xl font-extrabold leading-snug lg:text-4xl">{slide.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80 lg:mt-4 lg:text-base">{slide.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 bg-primary-dark px-6 pb-8 pt-5 lg:static lg:inset-auto lg:mx-auto lg:mt-10 lg:w-full lg:max-w-md lg:bg-transparent lg:px-20 lg:pb-0 lg:pt-0">
          <Button variant="light" onClick={goNext}>
            {isLast ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
