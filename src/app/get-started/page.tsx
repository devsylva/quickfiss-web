"use client";

import { useRouter } from "next/navigation";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { Button } from "@/components/ui/Button";

const images = ["/images/slide-1.png", "/images/slide-2.png", "/images/slide-3.png"];

export default function GetStartedPage() {
  const router = useRouter();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white lg:flex-row">
      <ImageCarousel images={images} className="h-[55%] shrink-0 lg:h-dvh lg:w-1/2" />

      <div className="flex flex-1 flex-col justify-end px-6 pb-16 lg:items-center lg:justify-center lg:w-1/2 lg:pb-0 lg:text-center">
        <div className="lg:w-full lg:max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight">
            <span className="text-primary">Tell us a bit about </span>
            <span className="text-emerald-500">yourself</span>
          </h1>
          <p className="mt-3 text-base text-muted">Let&rsquo;s customise your experience ☺️</p>
          <div className="mt-8">
            <Button onClick={() => router.push("/choose-role")}>Get started</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
