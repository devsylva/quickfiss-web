"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { Button } from "@/components/ui/Button";
import { categories } from "@/lib/categories";
import { categoryIcons } from "@/lib/categoryIcons";
import type { Provider } from "@/components/ui/ProviderCard";

import { ChevronLeftIcon } from "@/components/icons";

export function BookingStep1Content({ provider }: { provider: Provider }) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const isValid = description.trim() !== "" && category !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !category) return;
    const params = new URLSearchParams({ description, category });
    router.push(`/dashboard/booking/${provider.id}/step-2?${params.toString()}`);
  };

  return (
    <div className="flex min-h-dvh w-full items-start justify-center bg-zinc-50/60 px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="w-full lg:max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ChevronLeftIcon />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted shadow-2xs">
            <span>Booking with</span>
            <span className="font-semibold text-foreground">{provider.name}</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs sm:p-8 lg:p-10"
        >
          <WizardStepHeading step={1} totalSteps={4} title="Describe the service you need" />

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Description</p>
            <textarea
              placeholder="Clearly describe the task you need done, including details like size, type, and any specific requirements."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full resize-none rounded-input border border-emerald-200 bg-emerald-50/50 px-4 py-3.5 text-sm text-foreground placeholder-zinc-400 outline-none transition-all duration-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/15"
            />
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-foreground">Service Category</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {categories.map((c) => {
                const Icon = categoryIcons[c.slug];
                const selected = category === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCategory(c.slug)}
                    className={`flex items-center gap-2 rounded-input border px-3.5 py-3 text-xs sm:text-sm font-medium transition-colors ${
                      selected
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-border bg-white text-foreground hover:border-zinc-300"
                    }`}
                  >
                    <Icon size={18} color={selected ? "#059669" : "#10b981"} variant="Linear" />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" disabled={!isValid}>
              Next Step
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
