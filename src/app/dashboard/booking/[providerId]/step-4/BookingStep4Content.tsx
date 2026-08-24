"use client";

import { Suspense, useState } from "react";
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

function BookingStep4Inner({ provider }: { provider: Provider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState("paystack");
  const [showSuccess, setShowSuccess] = useState(false);

  const goBack = () => router.push(`/dashboard/booking/${provider.id}/step-3?${searchParams.toString()}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to the real booking/payment API once available.
    setShowSuccess(true);
  };

  const goToSummary = () => router.push(`/dashboard/booking/${provider.id}/summary?${searchParams.toString()}`);

  return (
    <div className="flex min-h-dvh w-full items-start justify-center bg-white px-6 py-10 pt-16 lg:pt-24">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <WizardStepHeading
          step={4}
          totalSteps={4}
          title="Payment option"
          rightSlot={
            <button type="button" onClick={goBack} aria-label="Close">
              <CloseCircle size={22} color="#171717" variant="Linear" />
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

        <div className="mt-8 flex flex-col gap-3">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="secondary" onClick={goBack}>
            Back
          </Button>
        </div>
      </form>

      <Modal open={showSuccess}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <TickCircle size={32} color="#3d5afe" variant="Bold" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-primary">Booking Successful</h2>
        <p className="mt-2 text-sm text-muted">You have successfully booked a service provider</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={goToSummary}>View Summary</Button>
          <Button variant="secondary" onClick={() => router.push(`/dashboard/provider/${provider.id}`)}>
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
