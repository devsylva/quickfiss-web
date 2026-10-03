"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TickCircle, CloseCircle } from "iconsax-react";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { RadioListItem } from "@/components/ui/RadioListItem";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Provider } from "@/components/ui/ProviderCard";

const PAYMENT_OPTIONS = [
  { value: "paystack", label: "Paystack" },
  { value: "korapay", label: "Kora Pay" },
  { value: "after-service", label: "Payment After Service" },
];

import { bookingsApi } from "@/lib/api/bookings";
import { chatApi } from "@/lib/api/chat";
import { ApiError } from "@/lib/api/client";
import { categories } from "@/lib/categories";
import { useBookingDraftStore } from "@/store/useBookingDraftStore";

/** "10:30:AM" (as stored in the wizard URL) -> "10:30:00" */
function to24Hour(raw: string): string {
  const [hourPart, minutePart = "00", meridiem = "AM"] = raw.split(":");
  let hour = parseInt(hourPart, 10);
  if (meridiem === "PM" && hour < 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minutePart.padStart(2, "0")}:00`;
}

function BookingStep4Inner({ provider }: { provider: Provider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState("paystack");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [error, setError] = useState<{ text: string; signIn: boolean; restart: boolean } | null>(null);

  const goBack = () => router.push(`/dashboard/booking/${provider.id}/step-3?${searchParams.toString()}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const description = searchParams.get("description");
    const category = categories.find((c) => c.slug === searchParams.get("category"));
    const location = searchParams.get("location");
    const rawDate = searchParams.get("date");
    const rawTime = searchParams.get("time");

    if (!description || !category || !location || !rawDate || !rawTime || provider.userId === undefined) {
      setError({
        text: "Some booking details are missing. Please go back to the first step and fill them in again.",
        signIn: false,
        restart: true,
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const booking = await bookingsApi.createBooking({
        artisian: provider.userId,
        service_name: category.label,
        service_description: description,
        service_category: category.apiName,
        location,
        date: new Date(rawDate).toISOString().split("T")[0],
        time: to24Hour(rawTime),
        payment_option: payment,
      });
      setBookingId(booking.id);

      // The booking exists now; a photo problem shouldn't make it look like it failed.
      const photos = useBookingDraftStore.getState().photosFor(provider.id);
      if (photos.length > 0) {
        try {
          await bookingsApi.uploadPhotos(booking.id, photos);
        } catch {
          setPhotoWarning("Your photos couldn't be uploaded, but the provider has your request.");
        }
      }
      useBookingDraftStore.getState().clear();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        setError({ text: "Your session has expired. Please sign in to continue.", signIn: true, restart: false });
      } else {
        setError({
          text: err instanceof Error ? err.message : "We couldn't place your booking. Please try again.",
          signIn: false,
          restart: false,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToSummary = () => router.push(`/dashboard/booking/${provider.id}/summary?booking=${bookingId}`);

  const messageProvider = async () => {
    if (isMessaging) return;
    setIsMessaging(true);
    try {
      const room = await chatApi.createChatRoom(Number(provider.id));
      router.push(`/dashboard/chats?room=${room.id}`);
    } catch {
      router.push("/dashboard/chats");
    }
  };

  return (
    <div className="flex min-h-dvh w-full items-start justify-center bg-zinc-50/60 px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="w-full lg:max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <span className="text-lg">‹</span>
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
          <WizardStepHeading
            step={4}
            totalSteps={4}
            title="Payment option"
            rightSlot={
              <button type="button" onClick={goBack} aria-label="Close" className="text-muted hover:text-foreground">
                <CloseCircle size={22} color="currentColor" variant="Linear" />
              </button>
            }
          />

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">Select Payment Option</p>
            <div className="flex flex-col gap-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <RadioListItem
                  key={opt.value}
                  label={opt.label}
                  selected={payment === opt.value}
                  onClick={() => setPayment(opt.value)}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              {error.text}{" "}
              {error.signIn && (
                <Link href="/sign-in" className="font-semibold underline">
                  Sign in
                </Link>
              )}
              {error.restart && (
                <Link href={`/dashboard/booking/${provider.id}/step-1`} className="font-semibold underline">
                  Start again
                </Link>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
            <div className="flex-1">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Confirming..." : "Confirm & Book"}
              </Button>
            </div>
            <div className="flex-1">
              <Button type="button" variant="secondary" onClick={goBack} disabled={isSubmitting}>
                Previous Step
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Modal open={bookingId !== null}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <TickCircle size={32} color="#3d5afe" variant="Bold" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-primary">Booking Successful</h2>
        <p className="mt-2 text-sm text-muted">
          Your request has been sent to {provider.name}. You&rsquo;ll be notified when they respond.
        </p>
        {photoWarning && (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-700">
            {photoWarning}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={goToSummary}>View Summary</Button>
          <Button variant="secondary" isLoading={isMessaging} onClick={messageProvider}>
            Message Provider
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export function BookingStep4Content({ provider }: { provider: Provider }) {
  return (
    <Suspense fallback={null}>
      <BookingStep4Inner provider={provider} />
    </Suspense>
  );
}
