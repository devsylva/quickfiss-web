"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { MultiPhotoUpload } from "@/components/ui/MultiPhotoUpload";
import { Button } from "@/components/ui/Button";
import { useBookingDraftStore } from "@/store/useBookingDraftStore";
import type { Provider } from "@/components/ui/ProviderCard";

function BookingStep3Inner({ provider }: { provider: Provider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Photos already chosen for this provider (kept across steps and refreshes).
  const [initialPhotos] = useState(() => useBookingDraftStore.getState().photosFor(provider.id));
  const [photoCount, setPhotoCount] = useState(initialPhotos.length);
  const setPhotos = useBookingDraftStore((s) => s.setPhotos);

  const goToStep4 = () => {
    router.push(`/dashboard/booking/${provider.id}/step-4?${searchParams.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoCount === 0) return;
    goToStep4();
  };

  return (
    <div className="flex min-h-dvh w-full items-start justify-center bg-zinc-50/60 px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="w-full lg:max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
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
            step={3}
            totalSteps={4}
            title="Show us what needs fixing"
            rightSlot={
              <button
                type="button"
                onClick={goToStep4}
                className="rounded-lg px-2.5 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
              >
                Skip
              </button>
            }
          />

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Attach Photos</p>
            <p className="mb-4 text-xs text-muted">Upload clear images of the item or area that needs attention.</p>
            <MultiPhotoUpload
            initialFiles={initialPhotos}
            onChange={(files) => {
              setPhotoCount(files.length);
              setPhotos(provider.id, files);
            }}
          />
          </div>

          <div className="mt-8">
            <Button type="submit" disabled={photoCount === 0}>
              Next Step
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function BookingStep3Content({ provider }: { provider: Provider }) {
  return (
    <Suspense fallback={null}>
      <BookingStep3Inner provider={provider} />
    </Suspense>
  );
}
