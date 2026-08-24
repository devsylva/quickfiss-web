"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { Button } from "@/components/ui/Button";
import { categories } from "@/lib/categories";
import { categoryIcons } from "@/lib/categoryIcons";
import type { Provider } from "@/components/ui/ProviderCard";

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
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-10">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
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
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => {
              const Icon = categoryIcons[c.slug];
              const selected = category === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                  className={`flex items-center gap-2 rounded-input border px-4 py-3 text-sm font-medium transition-colors ${
                    selected
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-border bg-white text-foreground hover:border-zinc-300"
                  }`}
                >
                  <Icon size={20} color={selected ? "#059669" : "#10b981"} variant="Linear" />
                  {c.label}
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
  );
}
