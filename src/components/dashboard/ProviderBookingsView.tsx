"use client";

import { useState } from "react";
import { Calendar, Location, Clock, Star1 } from "iconsax-react";
import { useProviderBookings } from "@/hooks/useProviderBookings";
import { ProviderJobActions } from "@/components/provider/ProviderJobActions";
import { formatBookingWhen } from "@/lib/formatBooking";
import { formatNaira } from "@/lib/money";
import type { Booking } from "@/types/api";

export type ProviderBookingTab = "new" | "active" | "completed";

const PAYMENT_BADGE: Record<string, { label: string; style: string }> = {
  unpaid: { label: "Awaiting payment", style: "bg-amber-50 text-amber-700" },
  held: { label: "Paid · in escrow", style: "bg-[#e8f5e9] text-[#2e7d32]" },
  released: { label: "Paid out", style: "bg-emerald-50 text-emerald-700" },
  refunded: { label: "Refunded", style: "bg-zinc-100 text-zinc-600" },
  disputed: { label: "Under review", style: "bg-red-50 text-red-700" },
};

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-white px-6 py-16 text-center sm:py-24">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary-light/40">
        <Clock size={36} color="#3d5afe" variant="Bold" />
      </div>
      <h2 className="text-base font-extrabold text-foreground sm:text-lg">{title}</h2>
      <p className="mt-1 text-xs text-muted sm:text-sm">{hint}</p>
    </div>
  );
}

function JobCard({ booking, onChange }: { booking: Booking; onChange: (b: Booking) => void }) {
  const badge = PAYMENT_BADGE[booking.payment_status];
  const money = booking.price ?? booking.budget;
  return (
    <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-extrabold capitalize text-foreground">{booking.service_name || booking.service_category}</h3>
          <p className="mt-0.5 text-xs font-medium text-muted">{booking.client_name ?? "Customer"}</p>
        </div>
        <div className="shrink-0 text-right">
          {money && <p className="text-base font-extrabold text-primary">{formatNaira(money)}</p>}
          {!booking.price && booking.budget && <p className="text-[11px] text-muted">Customer&apos;s budget</p>}
        </div>
      </div>

      {booking.booking_status !== "pending" && badge && booking.price && (
        <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.style}`}>{badge.label}</span>
      )}

      {booking.service_description && (
        <p className="mt-3 line-clamp-3 rounded-xl bg-[#f8f9fe] p-3 text-xs leading-relaxed text-zinc-700">{booking.service_description}</p>
      )}

      <div className="mt-3 space-y-1.5 text-xs text-muted">
        <div className="flex items-center gap-2">
          <Calendar size={15} color="#3d5afe" variant="Bold" />
          <span className="font-medium text-foreground">{formatBookingWhen(booking.date, booking.time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Location size={15} color="#3d5afe" variant="Bold" />
          <span>{booking.location}</span>
        </div>
      </div>

      {booking.photo?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {booking.photo.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="block h-16 w-16 overflow-hidden rounded-xl ring-1 ring-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Job photo" className="h-full w-full object-cover" />
            </a>
          ))}
        </div>
      )}

      {booking.is_reviewed && booking.client_rating > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <Star1 size={15} color="#f59e0b" variant="Bold" />
          <span className="font-bold text-foreground">{booking.client_rating}</span>
          {booking.client_review && <span className="truncate text-muted">&ldquo;{booking.client_review}&rdquo;</span>}
        </div>
      )}

      <div className="mt-4 border-t border-border/60 pt-3">
        <ProviderJobActions booking={booking} onChange={onChange} />
      </div>
    </div>
  );
}

export function ProviderBookingsView() {
  const { bookings, loading, error, update } = useProviderBookings();
  const [activeTab, setActiveTab] = useState<ProviderBookingTab>("new");

  const isActive = (b: Booking) => b.booking_status === "active" || (b.booking_status === "completed" && b.payment_status !== "released" && b.payment_status !== "refunded");
  const groups: Record<ProviderBookingTab, Booking[]> = {
    new: bookings.filter((b) => b.booking_status === "pending"),
    active: bookings.filter(isActive),
    completed: bookings.filter((b) => b.booking_status === "completed" && !isActive(b)),
  };
  const tabs: { key: ProviderBookingTab; label: string }[] = [
    { key: "new", label: "New Requests" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];
  const empty: Record<ProviderBookingTab, [string, string]> = {
    new: ["No new booking requests yet.", "Requests from customers will show up here."],
    active: ["No active bookings", "Accept a request and wait for the customer's payment to start a job."],
    completed: ["Nothing completed yet", "Finished and paid jobs will be listed here."],
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="flex items-center gap-3">
        <span className="h-7 w-1.5 rounded-full bg-primary" />
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Bookings</h1>
      </div>

      <div className="mt-6 flex items-center gap-2 sm:gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
              activeTab === tab.key ? "bg-primary-light text-primary shadow-xs" : "text-muted hover:bg-zinc-100 hover:text-foreground"
            }`}
          >
            {tab.label} {tab.key !== "completed" && groups[tab.key].length > 0 && `(${groups[tab.key].length})`}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center gap-3 rounded-card bg-zinc-50 p-5 text-sm text-muted">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading your bookings...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : groups[activeTab].length === 0 ? (
          <EmptyState title={empty[activeTab][0]} hint={empty[activeTab][1]} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {groups[activeTab].map((booking) => (
              <JobCard key={booking.id} booking={booking} onChange={update} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
