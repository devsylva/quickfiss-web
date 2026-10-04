"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TickCircle } from "iconsax-react";
import { StepHeader } from "@/components/ui/StepHeader";
import { Select } from "@/components/ui/Select";
import { FileInputRow } from "@/components/ui/FileInputRow";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useProviderOnboardingStore } from "@/store/useProviderOnboardingStore";
import { onboardingApi } from "@/lib/api";

const idTypes = [
  { value: "nin", label: "National ID (NIN)" },
  { value: "passport", label: "International Passport" },
  { value: "drivers-license", label: "Driver's License" },
  { value: "voters-card", label: "Voter's Card" },
];

export default function ProviderOnboardingStep3Page() {
  const router = useRouter();
  const store = useProviderOnboardingStore();

  const [idType, setIdType] = useState(store.idType || "nin");
  const [frontFile, setFrontFile] = useState<File | null>(store.idFront);
  const [backFile, setBackFile] = useState<File | null>(store.idBack);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = idType !== "" && frontFile !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    store.setKycStep3({ idType, idFront: frontFile, idBack: backFile });
    setError(null);

    // Steps 1-2 live in memory only, so a page refresh loses them.
    if (
      !store.firstName ||
      !store.lastName ||
      !store.day ||
      !store.month ||
      !store.year ||
      !store.gender ||
      !store.address
    ) {
      setError("Some details from the earlier steps are missing. Please go back to step 1 and fill them in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check every photo is still readable, and say which one isn't (steps 1 and 2 may have been
      // picked a while ago, and a phone can lose a camera photo in the meantime).
      const checks: [string, File | null, "profilePicture" | "proofOfAddress" | null, string][] = [
        ["profile photo", store.profilePicture, "profilePicture", "step 1"],
        ["proof of address", store.proofOfAddress, "proofOfAddress", "step 2"],
        ["ID (front)", frontFile, null, "this step"],
        ["ID (back)", backFile, null, "this step"],
      ];
      for (const [label, file, key, where] of checks) {
        if (!file) continue;
        try {
          await file.arrayBuffer();
        } catch {
          if (key) store.setKycStep1({ [key]: null } as never);
          throw new Error(`Your ${label} couldn't be read, so we removed it. Please choose it again on ${where}.`);
        }
      }

      const formData = new FormData();
      formData.append("first_name", store.firstName);
      formData.append("last_name", store.lastName);
      formData.append(
        "date_of_birth",
        `${store.year}-${store.month.padStart(2, "0")}-${store.day.padStart(2, "0")}`
      );
      formData.append("gender", store.gender);
      formData.append("address", store.address);
      if (store.landmark) formData.append("landmark", store.landmark);
      if (store.profilePicture) formData.append("profile_picture", store.profilePicture);
      if (store.proofOfAddress) formData.append("proof_of_address", store.proofOfAddress);

      formData.append("id_type", idType);
      if (frontFile) formData.append("id_front", frontFile);
      if (backFile) formData.append("id_back", backFile);

      await onboardingApi.submitArtisanKyc(formData);
      setShowSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit your details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="mt-10">
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Submitting Verification..." : "Submit Verification"}
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
