"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowDown2 } from "iconsax-react";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { Button } from "@/components/ui/Button";
import { findCategoryByApiName } from "@/lib/categories";
import { categoryIcons } from "@/lib/categoryIcons";
import { bookingsApi } from "@/lib/api/bookings";
import { formatBookingWhen } from "@/lib/formatBooking";
import { ApiError } from "@/lib/api/client";
import type { Provider } from "@/components/ui/ProviderCard";
import type { Booking } from "@/types/api";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; booking: Booking }
  | { status: "not-found" }
  | { status: "error"; message: string };

const PAYMENT_LABELS: Record<string, string> = {
  paystack: "Paystack",
  korapay: "Kora Pay",
  "after-service": "Payment after service",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  active: "bg-blue-50 text-primary",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting response",
  active: "Accepted",
  completed: "Completed",
  cancelled: "Cancelled",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">{children}</span>
    </div>
  );
}

function BookingSummaryInner({ provider }: { provider: Provider }) {
  const bookingId = useSearchParams().get("booking");
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    async function fetchBooking() {
      try {
        const booking = await bookingsApi.getBookingById(bookingId as string);
        if (!cancelled) setLoad({ status: "ready", booking });
      } catch (err: unknown) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setLoad({ status: "not-found" });
        else setLoad({ status: "error", message: err instanceof Error ? err.message : "We couldn't load this booking." });
      }
    }
    fetchBooking();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const state: LoadState = bookingId ? load : { status: "not-found" };

  return (
    <div className="flex min-h-dvh w-full items-start justify-center bg-white px-6 py-10 pt-16 lg:pt-24">
      <div className="w-full lg:max-w-xl">
        <WizardStepHeading title="Booking Summary" />

        {state.status === "loading" && (
          <div className="flex items-center gap-3 rounded-card bg-zinc-50 p-5 text-sm text-muted">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading your booking...
          </div>
        )}

        {(state.status === "not-found" || state.status === "error") && (
          <div className="rounded-card bg-zinc-50 p-5">
            <p className="text-sm text-foreground">
              {state.status === "not-found"
                ? "We couldn't find that booking."
                : state.message}
            </p>
            <Link href="/dashboard/bookings" className="mt-3 inline-block">
              <Button type="button" variant="secondary" className="!w-auto !px-5">
                View my bookings
              </Button>
            </Link>
          </div>
        )}

        {state.status === "ready" && (() => {
          const { booking } = state;
          const category = findCategoryByApiName(booking.service_category);
          const CategoryIcon = category ? categoryIcons[category.slug] : undefined;
          return (
            <>
              <div className="flex flex-col gap-4 rounded-card bg-zinc-50 p-5">
                <Row label="Status">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      STATUS_STYLES[booking.booking_status] ?? "bg-zinc-100 text-foreground"
                    }`}
                  >
                    {STATUS_LABELS[booking.booking_status] ?? booking.booking_status}
                  </span>
                </Row>
                <Row label="Category">
                  <span className="flex items-center justify-end gap-2">
                    {CategoryIcon && <CategoryIcon size={18} color="#3d5afe" variant="Linear" />}
                    <span className="capitalize">{category?.label ?? booking.service_category}</span>
                  </span>
                </Row>
                <Row label="Provider">
                  <span className="flex items-center justify-end gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                      {provider.name.charAt(0)}
                    </span>
                    {provider.name}
                  </span>
                </Row>
                <Row label="Date & Time">{formatBookingWhen(booking.date, booking.time)}</Row>
                <Row label="Location">{booking.location}</Row>
                <Row label="Payment">{PAYMENT_LABELS[booking.payment_option] ?? booking.payment_option}</Row>
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
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted">
                      {booking.service_description || "No additional details provided."}
                    </div>
                    {booking.photo.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {booking.photo.map((url) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="relative h-20 w-20 overflow-hidden rounded-input bg-zinc-100">
                            <Image src={url} alt="Attached photo" fill unoptimized className="object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/dashboard/bookings">
                  <Button type="button">View my bookings</Button>
                </Link>
              </div>
            </>
          );
        })()}
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
