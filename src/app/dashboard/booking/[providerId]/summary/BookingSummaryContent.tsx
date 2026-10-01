"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown2 } from "iconsax-react";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { categories } from "@/lib/categories";
import { categoryIcons } from "@/lib/categoryIcons";
import type { Provider } from "@/components/ui/ProviderCard";

const pad = (n: number) => String(n).padStart(2, "0");

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

function BookingSummaryInner({ provider }: { provider: Provider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [detailsOpen, setDetailsOpen] = useState(true);

  const description = searchParams.get("description") ?? "";
  const location = searchParams.get("location") ?? "";
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
    <div className="flex min-h-dvh w-full items-start justify-center bg-zinc-50/60 px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="w-full lg:max-w-2xl">
        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs sm:p-8 lg:p-10">
          <WizardStepHeading title="Booking Summary" />

          <div className="rounded-xl border border-border/80 bg-zinc-50/70 p-5 divide-y divide-border/60">
            <div className="flex items-center justify-between pb-3.5">
              <span className="text-sm text-muted">Category</span>
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {CategoryIcon && <CategoryIcon size={18} color="#3d5afe" variant="Linear" />}
                {category?.label ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-sm text-muted">Provider</span>
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                  {provider.name.charAt(0)}
                </span>
                {provider.name}
              </span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-sm text-muted">Date & Time</span>
              <span className="text-sm font-semibold text-foreground">
                {dateLabel} {timeLabel && `| ${timeLabel}`}
              </span>
            </div>
            {location && (
              <div className="flex items-center justify-between pt-3.5">
                <span className="text-sm text-muted">Location</span>
                <span className="text-sm font-semibold text-foreground max-w-[240px] truncate text-right">
                  {location}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-border/80 bg-zinc-50/70 p-5">
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              className="flex w-full items-center justify-between"
            >
              <span className="text-sm font-semibold text-foreground">Task Details</span>
              <ArrowDown2
                size={16}
                color="#a1a1aa"
                className={`transition-transform duration-300 ${detailsOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted">
                  {description || "No additional task details provided."}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Button onClick={() => router.push("/dashboard/bookings")}>View My Bookings</Button>
            </div>
            <div className="flex-1">
              <Button variant="secondary" onClick={() => router.push("/dashboard")}>
                Return to Dashboard
              </Button>
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
