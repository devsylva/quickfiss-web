"use client";

import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { SaveButton } from "@/components/ui/SaveButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DirectSend, Location, Briefcase, Star1, TickCircle } from "iconsax-react";
import { ChevronLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import { StarRatingDisplay } from "@/components/ui/StarRatingDisplay";
import { ArtisanStatus } from "@/components/ui/ArtisanStatus";
import { useArtisan } from "@/hooks/useArtisan";
import { bookingsApi } from "@/lib/api/bookings";
import { chatApi } from "@/lib/api/chat";
import { ApiError } from "@/lib/api/client";
import { getStoredAccessToken, useAuthStore } from "@/store/useAuthStore";

type Tab = "about" | "reviews";

export function ProviderDetailContent({ providerId }: { providerId: string }) {
  const router = useRouter();
  const { provider, status, error, reload } = useArtisan(providerId, { withReviews: true });
  const [tab, setTab] = useState<Tab>("about");
  const [showRateModal, setShowRateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [rateError, setRateError] = useState<string | null>(null);
  const [isRating, setIsRating] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  // A completed booking with this provider that the signed-in customer hasn't reviewed yet.
  const [reviewableBookingId, setReviewableBookingId] = useState<string | null>(null);

  const providerUserId = provider?.userId;
  // An account that is both customer and provider can't message or book itself.
  const myId = useAuthStore((st) => st.user?.id);
  const isMine = myId !== undefined && providerUserId !== undefined && Number(myId) === providerUserId;
  useEffect(() => {
    if (providerUserId === undefined || !getStoredAccessToken()) return;
    let cancelled = false;
    async function findReviewableBooking() {
      try {
        const bookings = await bookingsApi.getMyBookings();
        if (cancelled || !Array.isArray(bookings)) return;
        const match = bookings.find(
          (b) =>
            b.role === "client" &&
            b.artisian === providerUserId &&
            b.booking_status === "completed" &&
            !b.is_reviewed
        );
        setReviewableBookingId(match ? match.id : null);
      } catch {
        // Not signed in or offline: simply don't offer the review button.
      }
    }
    findReviewableBooking();
    return () => {
      cancelled = true;
    };
  }, [providerUserId]);

  if (!provider) {
    return <ArtisanStatus status={status === "ready" ? "loading" : status} error={error} onRetry={reload} />;
  }

  const handleSubmitRating = async () => {
    if (stars === 0 || !reviewableBookingId || isRating) return;
    setIsRating(true);
    setRateError(null);
    try {
      await bookingsApi.reviewBooking(reviewableBookingId, {
        client_rating: stars,
        client_review: reviewText.trim(),
      });
      setShowRateModal(false);
      setShowSuccessModal(true);
      setStars(0);
      setReviewText("");
      setReviewableBookingId(null);
      reload();
      setTimeout(() => setShowSuccessModal(false), 2500);
    } catch (err: unknown) {
      setRateError(err instanceof Error ? err.message : "We couldn't submit your review. Please try again.");
    } finally {
      setIsRating(false);
    }
  };

  const handleMessage = async () => {
    if (isMessaging) return;
    setIsMessaging(true);
    setMessageError(null);
    try {
      const room = await chatApi.createChatRoom(Number(provider.id));
      router.push(`/dashboard/chats?room=${room.id}`);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/sign-in");
        return;
      }
      setMessageError(err instanceof Error ? err.message : "We couldn't open the chat. Please try again.");
      setIsMessaging(false);
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white lg:flex-row">
      <div className="relative h-48 w-full shrink-0 lg:h-dvh lg:w-1/2">
        {provider.image ? (
          <Image src={provider.image} alt={provider.name} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-zinc-100" />
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30 text-foreground shadow backdrop-blur-md"
          >
            <ChevronLeftIcon />
          </button>
          <SaveButton providerId={provider.id} className="ml-auto mr-2 h-9 w-9 rounded-full bg-white/30 shadow backdrop-blur-md" />
          <button
            type="button"
            aria-label="Share"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30 shadow backdrop-blur-md"
          >
            <DirectSend size={20} color="#101828" variant="TwoTone" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-12 lg:py-8">
          <div className="lg:max-w-2xl lg:mx-auto">
            <div className="flex items-center gap-3 rounded-card bg-primary-light p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-primary">
                {provider.name.charAt(0)}
              </div>
              <div>
                <h1 className="flex items-center gap-1.5 text-lg font-extrabold text-foreground">
                  {provider.name}
                  {provider.verified && <VerifiedBadge size={18} />}
                </h1>
                {provider.tagline && <p className="text-sm text-muted">{provider.tagline}</p>}
                <div className="mt-1 flex items-center gap-2">
                  <StarRatingDisplay rating={provider.rating} size={14} />
                  <span className="text-sm font-medium text-foreground">{provider.rating.toFixed(1)}/5</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 rounded-card bg-primary-light p-1.5">
              <button
                type="button"
                onClick={() => setTab("about")}
                className={`flex-1 rounded-input py-3 text-sm font-semibold transition-colors ${
                  tab === "about" ? "bg-white text-foreground shadow-sm" : "text-muted"
                }`}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => setTab("reviews")}
                className={`flex-1 rounded-input py-2.5 text-sm transition-colors ${
                  tab === "reviews" ? "bg-white shadow-sm" : ""
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <span className="flex -space-x-2">
                    {(provider.reviews ?? []).slice(0, 3).map((review, i) => (
                      <span
                        key={`${review.name}-${i}`}
                        className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-primary"
                        style={{ backgroundColor: ["#c7ceff", "#a7b3ff", "#8b99ff"][i % 3] }}
                      >
                        {review.name.charAt(0)}
                      </span>
                    ))}
                  </span>
                  <span className="font-semibold text-foreground">
                    {provider.reviewCount >= 1000 ? `${(provider.reviewCount / 1000).toFixed(0)}k` : provider.reviewCount}
                  </span>
                </span>
                <span className="mt-0.5 block text-muted">Reviews</span>
              </button>
            </div>

            {tab === "about" ? (
              <div className="mt-6">
                <h2 className="text-base font-bold text-primary">About</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{provider.description}</p>

                <div className="mt-6 rounded-card bg-primary-light p-5">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    <div>
                      <p className="text-sm font-semibold text-primary">Location</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
                        <Location size={14} color="#171717" variant="Bold" />
                        {provider.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Experience</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
                        <Briefcase size={14} color="#171717" variant="Bold" />
                        {provider.experienceText}
                      </p>
                    </div>
                  </div>

                  <div className="my-5 h-px bg-primary/10" />

                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    <div>
                      <p className="text-sm font-semibold text-primary">Services</p>
                      <p className="mt-1 text-sm text-foreground">{provider.tags.join(", ") || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Starting Price</p>
                      <p className="mt-1 text-sm text-foreground">{provider.priceFrom || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="my-5 h-px bg-primary/10" />

                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    <div>
                      <p className="text-sm font-semibold text-primary">Availability</p>
                      <p className="mt-1 text-sm text-foreground">{provider.availabilityText}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Language</p>
                      <p className="mt-1 text-sm text-foreground">{provider.languageText}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Star1 size={20} color="#f5b400" variant="Bold" />
                    <span className="text-lg font-bold text-foreground">{provider.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted">({provider.reviewCount.toLocaleString()} ratings)</span>
                  </span>
                  {reviewableBookingId && (
                    <button
                      type="button"
                      onClick={() => setShowRateModal(true)}
                      className="text-sm font-semibold text-primary"
                    >
                      Rate
                    </button>
                  )}
                </div>

                {(provider.reviews ?? []).length === 0 && (
                  <p className="mt-6 text-center text-sm text-muted">
                    No reviews yet. Reviews appear here after customers complete a booking.
                  </p>
                )}

                <div className="mt-2 flex flex-col divide-y divide-border">
                  {(provider.reviews ?? []).map((review, index) => (
                    <div key={`${review.name}-${index}`} className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{review.name}</span>
                        <span className="text-xs text-muted">· {review.timeAgo}</span>
                      </div>
                      <div className="mt-1.5">
                        <StarRatingDisplay rating={review.rating} size={13} />
                      </div>
                      {review.title && <p className="mt-2 text-sm font-semibold text-foreground">{review.title}</p>}
                      <p className="mt-1 text-sm leading-relaxed text-muted">{review.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-white px-6 py-4 lg:px-12">
          {messageError && (
            <p className="mb-2 text-xs font-medium text-red-600 lg:max-w-2xl lg:mx-auto">{messageError}</p>
          )}
          {isMine ? (
            <p className="rounded-xl bg-zinc-50 p-3 text-center text-sm text-muted lg:max-w-2xl lg:mx-auto">
              This is your own provider profile. Switch to Provider to manage it.
            </p>
          ) : (
            <>
          <div className="flex items-center gap-4 lg:max-w-2xl lg:mx-auto">
            <button
              type="button"
              onClick={handleMessage}
              disabled={isMessaging}
              className="rounded-input border border-border px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-zinc-50 disabled:opacity-60"
            >
              {isMessaging ? "Opening..." : "Message"}
            </button>
            <div className="flex-1">
              {provider.isOpen ? (
                <Button onClick={() => router.push(`/dashboard/booking/${provider.id}/step-1`)}>Request Service</Button>
              ) : (
                <>
                  <Button disabled>Currently offline</Button>
                  <p className="mt-2 text-center text-xs text-muted">This provider isn&apos;t taking requests right now. Check back soon.</p>
                </>
              )}
            </div>
          </div>
            </>
          )}
        </div>
      </div>

      <Modal open={showRateModal} position="bottom">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Rate your worker</h2>
          <button type="button" onClick={() => setShowRateModal(false)} aria-label="Close">
            <span className="text-xl text-foreground">×</span>
          </button>
        </div>
        <div className="mt-4 h-px bg-border" />

        <p className="mt-4 text-sm font-semibold text-foreground">How did {provider.name} do?</p>
        <p className="mt-1 text-sm text-muted">Tell us about your experience from {provider.name}</p>

        <div className="mt-5">
          <StarRatingInput value={stars} onChange={setStars} />
        </div>

        <div className="mt-5">
          <Textarea placeholder="Write your review..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
        </div>

        {rateError && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{rateError}</p>
        )}

        <div className="mt-5">
          <Button disabled={stars === 0} isLoading={isRating} onClick={handleSubmitRating}>
            Submit
          </Button>
        </div>
      </Modal>

      <Modal open={showSuccessModal}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <TickCircle size={32} color="#3d5afe" variant="Bold" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-foreground">Your review has been submitted!</h2>
        <p className="mt-2 text-sm text-muted">Thank you for sharing your feedback, it helps others make informed choices.</p>
      </Modal>
    </div>
  );
}
