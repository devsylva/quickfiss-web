"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TickCircle } from "iconsax-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";
import { FileUploadBox } from "@/components/ui/FileUploadBox";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormError } from "@/components/ui/FormError";
import { onboardingApi } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/client";

const MAX_PICTURE_BYTES = 4 * 1024 * 1024;
const ALLOWED_PICTURE_TYPES = ["image/jpeg", "image/png"];

export default function CustomerOnboardingStep2Page() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  // Remounting the upload box clears its preview when a file is rejected.
  const [uploadKey, setUploadKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ text: string; signIn: boolean } | null>(null);

  const isValid = firstName.trim() !== "" && lastName.trim() !== "";

  const handlePictureSelect = (file: File | null) => {
    setError(null);
    if (!file) {
      setPicture(null);
      return;
    }
    if (!ALLOWED_PICTURE_TYPES.includes(file.type)) {
      setPicture(null);
      setUploadKey((k) => k + 1);
      setError({ text: "Please choose a JPG or PNG image.", signIn: false });
      return;
    }
    if (file.size > MAX_PICTURE_BYTES) {
      setPicture(null);
      setUploadKey((k) => k + 1);
      setError({ text: "That image is larger than 4MB. Please choose a smaller one.", signIn: false });
      return;
    }
    setPicture(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onboardingApi.saveClientProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        profile_picture: picture,
      });
      setShowSuccess(true);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        setError({ text: "Your session has expired. Please sign in to continue.", signIn: true });
      } else {
        setError({
          text: err instanceof Error ? err.message : "Could not save your details. Please try again.",
          signIn: false,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12 lg:py-16">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-2xl">
        <ProgressBar percent={100} />

        <h1 className="mt-6 text-2xl font-extrabold leading-snug text-primary sm:text-3xl lg:text-4xl">
          Let&rsquo;s get to know you
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">Enter your basic details to get started</p>

        <div className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="First Name" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last Name" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Profile Picture</p>
            <FileUploadBox
              key={uploadKey}
              helperText="JPG and PNG files supported. Max size 4MB."
              onFileSelect={handlePictureSelect}
            />
          </div>
        </div>

        <FormError message={error?.text ?? null} signIn={error?.signIn} />

        <div className="mt-8">
          <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
            Submit
          </Button>
        </div>
      </form>

      <Modal open={showSuccess}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <TickCircle size={32} color="#3d5afe" variant="Bold" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-foreground">Profile Setup Complete 🎉</h2>
        <div className="mt-6">
          <Button onClick={() => router.push(`/customer-onboarding/step-3?name=${encodeURIComponent(firstName)}`)}>
            Start Exploring
          </Button>
        </div>
      </Modal>
    </div>
  );
}
