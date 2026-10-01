"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepHeader } from "@/components/ui/StepHeader";
import { Input } from "@/components/ui/Input";
import { FileInputRow } from "@/components/ui/FileInputRow";
import { Button } from "@/components/ui/Button";

import { useProviderOnboardingStore } from "@/store/useProviderOnboardingStore";

export default function ProviderOnboardingStep2Page() {
  const router = useRouter();
  const store = useProviderOnboardingStore();

  const [address, setAddress] = useState(store.address);
  const [landmark, setLandmark] = useState(store.landmark);
  const [proofFile, setProofFile] = useState<File | null>(store.proofOfAddress);

  const isValid = address.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    store.setKycStep2({
      address,
      landmark,
      proofOfAddress: proofFile,
    });
    router.push("/provider-onboarding/step-3");
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <StepHeader
          step={2}
          totalSteps={4}
          title="Where are you located?"
          subtitle="Your location helps us connect you with local experts."
        />

        <div className="flex flex-col gap-5">
          <Input
            label="Complete Address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <FileInputRow
            label="Upload Proof of Address"
            description="(e.g Utility bill, Bank statement)"
            onFileSelect={setProofFile}
          />

          <Input
            label="Landmark"
            placeholder="Nearest Landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
        </div>

        <div className="mt-8">
          <Button type="submit" disabled={!isValid}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
