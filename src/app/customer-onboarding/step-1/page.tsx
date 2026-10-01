"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SelectListItem } from "@/components/ui/SelectListItem";
import { Button } from "@/components/ui/Button";

const categories = [
  "Automotive",
  "Cleaning & Waste",
  "Food & Catering",
  "Home Services",
  "Logistics",
  "Personal care",
  "Tech & Electronics",
];

export default function CustomerOnboardingStep1Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (category: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.size === 0) return;
    // TODO: wire up to the real customer-onboarding API once available.
    router.push("/customer-onboarding/step-2");
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12 lg:py-16">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-2xl">
        <ProgressBar percent={50} />

        <h1 className="mt-6 text-2xl font-extrabold leading-snug text-primary sm:text-3xl lg:text-4xl">
          Personalise your experience
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">What services are you interested in?</p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <SelectListItem
              key={category}
              label={category}
              selected={selected.has(category)}
              onClick={() => toggle(category)}
            />
          ))}
        </div>

        <div className="mt-8">
          <Button type="submit" disabled={selected.size === 0}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
