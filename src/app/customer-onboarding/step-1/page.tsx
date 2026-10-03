"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SelectListItem } from "@/components/ui/SelectListItem";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { onboardingApi } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/client";

// `apiName` is the exact category name the backend stores and validates against.
const categories = [
  { label: "Automotive", apiName: "Automotive" },
  { label: "Cleaning & Waste", apiName: "Cleaning and Waste" },
  { label: "Food & Catering", apiName: "Food and Catering" },
  { label: "Home Services", apiName: "Home Services" },
  { label: "Logistics", apiName: "Logistics" },
  { label: "Personal care", apiName: "Personal Care" },
  { label: "Tech & Electronics", apiName: "Tech and Electronics" },
];

export default function CustomerOnboardingStep1Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ text: string; signIn: boolean } | null>(null);

  const toggle = (category: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.size === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onboardingApi.saveClientProfile({
        preferred_categories: categories.filter((c) => selected.has(c.apiName)).map((c) => c.apiName),
      });
      router.push("/customer-onboarding/step-2");
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        setError({ text: "Your session has expired. Please sign in to continue.", signIn: true });
      } else {
        setError({
          text: err instanceof Error ? err.message : "Could not save your choices. Please try again.",
          signIn: false,
        });
      }
      setIsSubmitting(false);
    }
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
              key={category.apiName}
              label={category.label}
              selected={selected.has(category.apiName)}
              onClick={() => toggle(category.apiName)}
            />
          ))}
        </div>

        <FormError message={error?.text ?? null} signIn={error?.signIn} />

        <div className="mt-8">
          <Button type="submit" disabled={selected.size === 0} isLoading={isSubmitting}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
