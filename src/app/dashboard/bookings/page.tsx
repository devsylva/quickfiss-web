"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, Location, TickCircle, CloseCircle, Star1, Image as ImageIcon } from "iconsax-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import { bookingsApi } from "@/lib/api/bookings";
import { walletApi } from "@/lib/api/wallet";
import { formatNaira } from "@/lib/money";
import { formatBookingWhen } from "@/lib/formatBooking";
import { findCategoryByApiName } from "@/lib/categories";
import type { Booking } from "@/types/api";
import { useAuthStore } from "@/store/useAuthStore";
import { ProviderBookingsView } from "@/components/dashboard/ProviderBookingsView";
import { ProviderGate } from "@/components/provider/ProviderGate";

type Tab = "all" | "upcoming" | "completed" | "cancelled";

function BookingsContent() {
  const { activeRole, initAuth } = useAuthStore();
  const returnedFor = useSearchParams().get("pay");
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
  const [payTarget, setPayTarget] = useState<Booking | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isPaying, setIsPaying] = useState<"wallet" | "card" | null>(null);
  const [disputeTarget, setDisputeTarget] = useState<Booking | null>(null);
  const [disputeText, setDisputeText] = useState("");
  const [isConfirming, setIsConfirming] = useState<string | null>(null);
  const [isDisputing, setIsDisputing] = useState(false);

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

    async function settleReturnedPayment() {
      // Coming back from Paystack: confirm the card payment so the money moves into escrow.
      if (!returnedFor) return;
      try {
        const updated = await bookingsApi.verifyPayment(returnedFor);
        if (isMounted) {
          setNotice(
            updated.payment_status === "held"
              ? "Payment received. Your money is held safely until the job is done."
              : "We're still waiting for your payment to be confirmed. Refresh in a moment.",
          );
        }
      } catch {
        // the list below still shows the booking's real state
      }
    }

    settleReturnedPayment().then(fetchBookings);
    return () => {
      isMounted = false;
    };
  }, [returnedFor]);

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

  const openPay = async (booking: Booking) => {
    setActionError(null);
    setPayTarget(booking);
    setWalletBalance(null);
    try {
      const wallet = await walletApi.getMyWallet();
      setWalletBalance(Number(wallet.balance));
    } catch {
      setWalletBalance(null);
    }
  };

  const payFromWallet = async () => {
    if (!payTarget || isPaying) return;
    setIsPaying("wallet");
    setActionError(null);
    try {
      replaceBooking(await bookingsApi.payFromWallet(payTarget.id));
      setPayTarget(null);
      setNotice("Payment received. Your money is held safely until the job is done.");
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "We couldn't take that payment. Please try again.");
    } finally {
      setIsPaying(null);
    }
  };

  const payByCard = async () => {
    if (!payTarget || isPaying) return;
    setIsPaying("card");
    setActionError(null);
    try {
      const { authorization_url } = await bookingsApi.payByCard(
        payTarget.id,
        `${window.location.origin}/dashboard/bookings?pay=${payTarget.id}`,
      );
      window.location.assign(authorization_url);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "We couldn't start the payment. Please try again.");
      setIsPaying(null);
    }
  };

  const confirmDone = async (booking: Booking) => {
    if (isConfirming) return;
    setIsConfirming(booking.id);
    setActionError(null);
    try {
      replaceBooking(await bookingsApi.confirmBooking(booking.id));
      setNotice("Thanks! Your provider has been paid.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We couldn't confirm this job. Please try again.");
    } finally {
      setIsConfirming(null);
    }
  };

  const submitDispute = async () => {
    if (!disputeTarget || isDisputing) return;
    setIsDisputing(true);
    setActionError(null);
    try {
      replaceBooking(await bookingsApi.disputeBooking(disputeTarget.id, disputeText.trim()));
      setDisputeTarget(null);
      setDisputeText("");
      setNotice("We've paused the payment and will review your report.");
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "We couldn't send your report. Please try again.");
    } finally {
      setIsDisputing(false);
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
        <ProviderGate>
          <ProviderBookingsView />
        </ProviderGate>
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

                  {booking.price && status !== "cancelled" && (
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-xs">
                      <span className="font-medium text-muted">
                        {booking.payment_status === "unpaid"
                          ? "Quote"
                          : booking.payment_status === "held"
                            ? "Held in escrow"
                            : booking.payment_status === "disputed"
                              ? "Payment on hold"
                              : booking.payment_status === "refunded"
                                ? "Refunded"
                                : "Paid"}
                      </span>
                      <span className="text-sm font-extrabold text-primary">{formatNaira(booking.price)}</span>
                    </div>
                  )}
                  {status === "completed" && booking.payment_status === "held" && (
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">
                      Your provider says the job is done. Confirm to pay them
                      {booking.auto_release_at
                        ? `, or they're paid automatically on ${new Date(booking.auto_release_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : ""}
                      .
                    </p>
                  )}
                  {booking.payment_status === "disputed" && (
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">
                      You reported a problem. We&rsquo;re reviewing it and will refund you or pay the provider.
                    </p>
                  )}

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
                    {status === "active" && booking.payment_status === "unpaid" && booking.price && (
                      <button
                        type="button"
                        onClick={() => openPay(booking)}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        Pay {formatNaira(booking.price)}
                      </button>
                    )}
                    {status === "completed" && booking.payment_status === "held" && (
                      <>
                        <button
                          type="button"
                          disabled={isConfirming === booking.id}
                          onClick={() => confirmDone(booking)}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {isConfirming === booking.id ? "Confirming..." : "Confirm job done"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null);
                            setDisputeTarget(booking);
                          }}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                        >
                          Report a problem
                        </button>
                      </>
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
          {cancelTarget?.payment_status === "held" ? " Your payment will be refunded to your wallet." : ""}
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

      <Modal open={payTarget !== null} position="bottom">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Pay {payTarget ? formatNaira(payTarget.price) : ""}</h2>
          <button type="button" onClick={() => setPayTarget(null)} aria-label="Close">
            <span className="text-xl text-foreground">×</span>
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Your money is held safely by Quickfiss and only released to {payTarget?.artisan_name || "your provider"} once you
          confirm the job is done.
        </p>
        {actionError && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{actionError}</p>
        )}
        <div className="mt-5 flex flex-col gap-3">
          <Button
            isLoading={isPaying === "wallet"}
            disabled={isPaying !== null || (walletBalance !== null && payTarget !== null && walletBalance < Number(payTarget.price))}
            onClick={payFromWallet}
          >
            Pay from wallet{walletBalance !== null ? ` (${formatNaira(walletBalance)})` : ""}
          </Button>
          <Button variant="secondary" isLoading={isPaying === "card"} disabled={isPaying !== null} onClick={payByCard}>
            Pay with card
          </Button>
          {walletBalance !== null && payTarget !== null && walletBalance < Number(payTarget.price) && (
            <Link href="/dashboard/wallet" className="text-center text-xs font-semibold text-primary">
              Add money to your wallet
            </Link>
          )}
        </div>
      </Modal>

      <Modal open={disputeTarget !== null} position="bottom">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Report a problem</h2>
          <button type="button" onClick={() => setDisputeTarget(null)} aria-label="Close">
            <span className="text-xl text-foreground">×</span>
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Tell us what went wrong. The payment stays on hold while we look into it.
        </p>
        <div className="mt-4">
          <Textarea placeholder="What went wrong?" value={disputeText} onChange={(e) => setDisputeText(e.target.value)} />
        </div>
        {actionError && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{actionError}</p>
        )}
        <div className="mt-5">
          <Button disabled={disputeText.trim().length < 10} isLoading={isDisputing} onClick={submitDispute}>
            Send report
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

export default function BookingsPage() {
  return (
    <Suspense fallback={null}>
      <BookingsContent />
    </Suspense>
  );
}
