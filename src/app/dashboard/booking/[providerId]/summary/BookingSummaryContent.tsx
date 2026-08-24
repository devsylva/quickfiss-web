"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown2 } from "iconsax-react";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { categories } from "@/lib/categories";
import { categoryIcons } from "@/lib/categoryIcons";
import type { Provider } from "@/components/ui/ProviderCard";

const pad = (n: number) => String(n).padStart(2, "0");

function BookingSummaryInner({ provider }: { provider: Provider }) {
  const searchParams = useSearchParams();
  const [detailsOpen, setDetailsOpen] = useState(true);

  const description = searchParams.get("description") ?? "";
  const categorySlug = searchParams.get("category") ?? "";
  const category = categories.find((c) => c.slug === categorySlug);
  const CategoryIcon = categorySlug ? categoryIcons[categorySlug] : undefined;

  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const dateLabel = dateParam
    ? new Date(dateParam).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  let timeLabel = "";
  if (timeParam) {
    const [hour, minute, meridiem] = timeParam.split(":");
    timeLabel = `${pad(Number(hour))}:${pad(Number(minute))} ${meridiem}`;
  }

  return (
    <div className="flex min-h-dvh w-full items-start justify-center bg-white px-6 py-10 pt-16 lg:pt-24">
      <div className="w-full lg:max-w-xl">
        <WizardStepHeading title="Booking Summary" />

        <div className="rounded-card bg-zinc-50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Category</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {CategoryIcon && <CategoryIcon size={18} color="#3d5afe" variant="Linear" />}
              {category?.label ?? "—"}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted">Provider</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                {provider.name.charAt(0)}
              </span>
              {provider.name}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted">Date & Time</span>
            <span className="text-sm font-semibold text-foreground">
              {dateLabel} {timeLabel && `| ${timeLabel}`}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-card bg-zinc-50 p-5">
          <button
            type="button"
            onClick={() => setDetailsOpen((v) => !v)}
            className="flex w-full items-center justify-between"
          >
            <span className="text-sm font-semibold text-foreground">Service Details</span>
            <ArrowDown2
              size={16}
              color="#a1a1aa"
              className={`transition-transform duration-300 ${detailsOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div className={`grid transition-[grid-template-rows] duration-300 ${detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <div className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted">
                {description || "No additional details provided."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingSummaryContent({ provider }: { provider: Provider }) {
  return (
    <Suspense fallback={null}>
      <BookingSummaryInner provider={provider} />
    </Suspense>
  );
}
