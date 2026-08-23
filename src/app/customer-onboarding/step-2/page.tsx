"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TickCircle } from "iconsax-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";
import { FileUploadBox } from "@/components/ui/FileUploadBox";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function CustomerOnboardingStep2Page() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isValid = firstName.trim() !== "" && lastName.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: wire up to the real customer-onboarding API once available.
    setShowSuccess(true);
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <ProgressBar percent={100} />

        <h1 className="mt-6 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">
          Let&rsquo;s get to know you
        </h1>
        <p className="mt-2 text-sm text-muted">Enter your basic details to get started</p>

        <div className="mt-6 flex flex-col gap-5">
          <Input placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Profile Picture</p>
            <FileUploadBox helperText="JPG and PNG files supported. Max size 4MB." />
          </div>
        </div>

        <div className="mt-8">
          <Button type="submit" disabled={!isValid}>
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
