"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Location, TickCircle, CloseCircle, Star1, Image as ImageIcon } from "iconsax-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import { bookingsApi } from "@/lib/api/bookings";
import { formatBookingWhen } from "@/lib/formatBooking";
import { findCategoryByApiName } from "@/lib/categories";
import type { Booking } from "@/types/api";
import { useAuthStore } from "@/store/useAuthStore";
import { ProviderBookingsView } from "@/components/dashboard/ProviderBookingsView";

type Tab = "all" | "upcoming" | "completed" | "cancelled";

export default function BookingsPage() {
  const { activeRole, initAuth } = useAuthStore();
  const [tab, setTab] = useState<Tab>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    let isMounted = true;
    async function fetchBookings() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await bookingsApi.getMyBookings();
        if (isMounted) {
          // This screen is the customer's view: only bookings they made.
          setBookings(Array.isArray(data) ? data.filter((b) => (b.role ?? "client") === "client") : []);
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
    if (tab === "upcoming") return status === "pending" || status === "active";
    if (tab === "completed") return status === "completed";
    if (tab === "cancelled") return status === "cancelled";
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
    if (s === "active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
          Accepted
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <CloseCircle size={14} color="#dc2626" variant="Bold" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        Pending
      </span>
    );
  };

  const replaceBooking = (updated: Booking) =>
    setBookings((current) => current.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)));

  const confirmCancel = async () => {
    if (!cancelTarget || isCancelling) return;
    setIsCancelling(true);
    setActionError(null);
    try {
      replaceBooking(await bookingsApi.rejectBooking(cancelTarget.id));
      setCancelTarget(null);
      setNotice("Your booking has been cancelled.");
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "We couldn't cancel this booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const submitReview = async () => {
    if (!reviewTarget || stars === 0 || isReviewing) return;
    setIsReviewing(true);
    setActionError(null);
    try {
      replaceBooking(
        await bookingsApi.reviewBooking(reviewTarget.id, { client_rating: stars, client_review: reviewText.trim() })
      );
      setReviewTarget(null);
      setStars(0);
      setReviewText("");
      setNotice("Thanks! Your review has been submitted.");
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "We couldn't submit your review. Please try again.");
    } finally {
      setIsReviewing(false);
    }
  };

  if (activeRole === "provider") {
    return (
      <DashboardShell>
        <ProviderBookingsView />
      </DashboardShell>
    );
  }

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

        {notice && (
          <div className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
              <CloseCircle size={16} color="currentColor" variant="Linear" />
            </button>
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
            {filteredBookings.map((booking) => {
              const status = (booking.booking_status || "").toLowerCase();
              const category = findCategoryByApiName(booking.service_category);
              return (
                <div
                  key={booking.id}
                  className="flex flex-col rounded-2xl border border-border/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold capitalize text-foreground">{category?.label ?? booking.service_name}</h3>
                      <p className="text-xs font-medium text-muted">with {booking.artisan_name || "your provider"}</p>
                    </div>
                    {getStatusBadge(booking.booking_status)}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">{booking.service_description}</p>

                  <div className="mt-4 flex flex-col gap-1.5 border-t border-border/60 pt-3 text-xs text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} color="#3d5afe" variant="Bold" />
                      <span>{formatBookingWhen(booking.date, booking.time)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted truncate">
                      <Location size={14} color="#71717a" variant="Bold" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                    {booking.photo.length > 0 && (
                      <div className="flex items-center gap-1.5 text-muted">
                        <ImageIcon size={14} color="#71717a" variant="Linear" />
                        <span>
                          {booking.photo.length} photo{booking.photo.length === 1 ? "" : "s"} attached
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                    {booking.artisan_profile_id && (
                      <Link
                        href={`/dashboard/booking/${booking.artisan_profile_id}/summary?booking=${booking.id}`}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-zinc-50"
                      >
                        View details
                      </Link>
                    )}
                    {(status === "pending" || status === "active") && (
                      <button
                        type="button"
                        onClick={() => {
                          setActionError(null);
                          setCancelTarget(booking);
                        }}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                      >
                        Cancel booking
                      </button>
                    )}
                    {status === "completed" && !booking.is_reviewed && (
                      <button
                        type="button"
                        onClick={() => {
                          setActionError(null);
                          setReviewTarget(booking);
                        }}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        Rate &amp; review
                      </button>
                    )}
                    {status === "completed" && booking.is_reviewed && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                        <Star1 size={14} color="#f5b400" variant="Bold" />
                        You rated {booking.client_rating}/5
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={cancelTarget !== null}>
        <h2 className="text-lg font-bold text-foreground">Cancel this booking?</h2>
        <p className="mt-2 text-sm text-muted">
          {cancelTarget?.artisan_name || "The provider"} will be told it&rsquo;s been cancelled.
        </p>
        {actionError && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{actionError}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Button isLoading={isCancelling} onClick={confirmCancel}>
            Yes, cancel booking
          </Button>
          <Button variant="secondary" disabled={isCancelling} onClick={() => setCancelTarget(null)}>
            Keep booking
          </Button>
        </div>
      </Modal>

      <Modal open={reviewTarget !== null} position="bottom">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Rate your worker</h2>
          <button type="button" onClick={() => setReviewTarget(null)} aria-label="Close">
            <span className="text-xl text-foreground">×</span>
          </button>
        </div>
        <div className="mt-4 h-px bg-border" />
        <p className="mt-4 text-sm font-semibold text-foreground">
          How did {reviewTarget?.artisan_name || "your provider"} do?
        </p>
        <div className="mt-5">
          <StarRatingInput value={stars} onChange={setStars} />
        </div>
        <div className="mt-5">
          <Textarea placeholder="Write your review..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
        </div>
        {actionError && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{actionError}</p>
        )}
        <div className="mt-5">
          <Button disabled={stars === 0} isLoading={isReviewing} onClick={submitReview}>
            Submit
          </Button>
        </div>
      </Modal>
    </DashboardShell>
  );
}
