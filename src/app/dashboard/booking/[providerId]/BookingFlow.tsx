"use client";

import { useEffect, useState } from "react";
import type { Provider } from "@/components/ui/ProviderCard";
import { ArtisanStatus } from "@/components/ui/ArtisanStatus";
import { useArtisan } from "@/hooks/useArtisan";
import { useBookingDraftStore } from "@/store/useBookingDraftStore";
import { BookingStep1Content } from "./step-1/BookingStep1Content";
import { BookingStep2Content } from "./step-2/BookingStep2Content";
import { BookingStep3Content } from "./step-3/BookingStep3Content";
import { BookingStep4Content } from "./step-4/BookingStep4Content";
import { BookingSummaryContent } from "./summary/BookingSummaryContent";

export type BookingStepName = "step-1" | "step-2" | "step-3" | "step-4" | "summary";

const STEPS: Record<BookingStepName, React.ComponentType<{ provider: Provider }>> = {
  "step-1": BookingStep1Content,
  "step-2": BookingStep2Content,
  "step-3": BookingStep3Content,
  "step-4": BookingStep4Content,
  summary: BookingSummaryContent,
};

/**
 * Loads the provider being booked (and restores any saved photos) before showing a wizard step,
 * so every step has the real provider, including the account id a booking needs.
 */
export function BookingFlow({ providerId, step }: { providerId: string; step: BookingStepName }) {
  const { provider, status, error, reload } = useArtisan(providerId);
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(useBookingDraftStore.persist.rehydrate()).finally(() => {
      if (!cancelled) setDraftReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!provider) {
    return <ArtisanStatus status={status === "ready" ? "loading" : status} error={error} onRetry={reload} />;
  }
  if (!draftReady) return <ArtisanStatus status="loading" />;

  const Step = STEPS[step];
  return <Step provider={provider} />;
}
