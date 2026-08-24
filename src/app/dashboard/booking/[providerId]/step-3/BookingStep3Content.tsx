"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { MultiPhotoUpload } from "@/components/ui/MultiPhotoUpload";
import { Button } from "@/components/ui/Button";
import type { Provider } from "@/components/ui/ProviderCard";

function BookingStep3Inner({ provider }: { provider: Provider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [photoCount, setPhotoCount] = useState(0);

  const goToStep4 = () => {
    router.push(`/dashboard/booking/${provider.id}/step-4?${searchParams.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoCount === 0) return;
    goToStep4();
  };

  return (
    <div className="flex min-h-dvh w-full items-start justify-center bg-white px-6 py-10 pt-16 lg:pt-24">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <WizardStepHeading
          step={3}
          totalSteps={4}
          title="Show us what needs fixing"
          rightSlot={
            <button type="button" onClick={goToStep4} className="text-sm font-semibold text-primary">
              Skip
            </button>
          }
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Photo</p>
          <MultiPhotoUpload onChange={(files) => setPhotoCount(files.length)} />
        </div>

        <div className="mt-8">
          <Button type="submit" disabled={photoCount === 0}>
            Next Step
          </Button>
        </div>
      </form>
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
