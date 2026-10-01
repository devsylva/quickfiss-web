"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Location, Clock, TickCircle, CloseCircle } from "iconsax-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { bookingsApi } from "@/lib/api/bookings";
import type { Booking } from "@/types/api";

type Tab = "all" | "upcoming" | "completed" | "cancelled";

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchBookings() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await bookingsApi.getMyBookings();
        if (isMounted) {
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMsg = err instanceof Error ? err.message : "Failed to load bookings";
          setError(errorMsg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const status = (b.booking_status || "").toLowerCase();
    if (tab === "all") return true;
    if (tab === "upcoming") return status === "pending" || status === "accepted";
    if (tab === "completed") return status === "completed";
    if (tab === "cancelled") return status === "rejected" || status === "cancelled";
    return true;
  });

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <TickCircle size={14} color="#059669" variant="Bold" />
          Completed
        </span>
      );
    }
    if (s === "accepted") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
          Accepted
        </span>
      );
    }
    if (s === "rejected" || s === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <CloseCircle size={14} color="#dc2626" variant="Bold" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        Pending
      </span>
    );
  };

  return (
    <DashboardShell>
      <div className="px-6 py-6 lg:px-10 lg:py-8 lg:max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">My Bookings</h1>
            <p className="mt-1 text-sm text-muted">Track and manage your scheduled service appointments.</p>
          </div>
          <Link href="/dashboard">
            <Button variant="secondary" className="!w-auto !py-2.5 !px-4 text-xs font-semibold">
              Find a Provider
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          <Chip selected={tab === "all"} onClick={() => setTab("all")}>All</Chip>
          <Chip selected={tab === "upcoming"} onClick={() => setTab("upcoming")}>Upcoming</Chip>
          <Chip selected={tab === "completed"} onClick={() => setTab("completed")}>Completed</Chip>
          <Chip selected={tab === "cancelled"} onClick={() => setTab("cancelled")}>Cancelled</Chip>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-8 flex flex-col items-center justify-center p-12 text-sm text-muted">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="mt-3">Loading your bookings...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-zinc-50/60 p-12 text-center lg:py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
              <Calendar size={28} color="#3d5afe" variant="Bold" />
            </div>
            <h2 className="mt-4 text-base font-bold text-foreground">
              No {tab !== "all" ? tab : ""} bookings found
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-muted">
              When you book home repairs, catering, or cleaning services, your appointments will appear here.
            </p>
            <div className="mt-6">
              <Link href="/dashboard">
                <Button className="!w-auto !px-6">Book a Service Now</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-border/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{booking.service_name}</h3>
                    <p className="text-xs font-medium text-muted">{booking.service_category}</p>
                  </div>
                  {getStatusBadge(booking.booking_status)}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">
                  {booking.service_description}
                </p>

                <div className="mt-4 flex flex-col gap-1.5 border-t border-border/60 pt-3 text-xs text-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} color="#3d5afe" variant="Bold" />
                    <span>{booking.date}</span>
                    <span className="text-muted">·</span>
                    <Clock size={14} color="#71717a" variant="Linear" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted truncate">
                    <Location size={14} color="#71717a" variant="Bold" />
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
