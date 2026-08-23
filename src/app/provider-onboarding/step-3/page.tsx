"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TickCircle } from "iconsax-react";
import { StepHeader } from "@/components/ui/StepHeader";
import { Select } from "@/components/ui/Select";
import { FileInputRow } from "@/components/ui/FileInputRow";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const idTypes = [
  { value: "nin", label: "National ID (NIN)" },
  { value: "passport", label: "International Passport" },
  { value: "drivers-license", label: "Driver's License" },
  { value: "voters-card", label: "Voter's Card" },
];

export default function ProviderOnboardingStep3Page() {
  const router = useRouter();
  const [idType, setIdType] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const isValid = idType !== "" && frontFile !== null && backFile !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: wire up to the real provider-onboarding API once available.
    setShowSuccess(true);
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <StepHeader
          step={3}
          totalSteps={4}
          title="Verify your Identity"
          subtitle="Upload a valid ID and take a quick selfie for security"
        />

        <div className="flex flex-col gap-5">
          <Select
            label="Upload Government ID"
            placeholder="Select"
            options={idTypes}
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
          />

          <FileInputRow
            label="Proof of Identity (front)"
            description="(e.g NIN, Passport, Photo)"
            onFileSelect={setFrontFile}
          />

          <FileInputRow label="Proof of Identity (back)" onFileSelect={setBackFile} />
        </div>

        <div className="mt-10">
          <Button type="submit" disabled={!isValid}>
            Submit Verification
          </Button>
        </div>
      </form>

      <Modal open={showSuccess}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <TickCircle size={32} color="#3d5afe" variant="Bold" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-foreground">Profile Setup Complete 🎉</h2>
        <div className="mt-6">
          <Button onClick={() => router.push("/provider-onboarding/step-4")}>Start Exploring</Button>
        </div>
      </Modal>
    </div>
  );
}
