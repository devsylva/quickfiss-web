"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BackButton } from "@/components/ui/BackButton";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  // Shared by both the sign-up (→ /get-started) and forgot-password
  // (→ /reset-password) flows — the caller says where "Continue" goes next.
  const next = searchParams.get("next") ?? "/reset-password";
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = digits.every((d) => d !== "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    // TODO: wire up to the real auth API once available.
    router.push(next);
  };

  const handleResend = () => {
    // TODO: wire up to the real auth API once available.
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <BackButton />

        <h1 className="text-2xl font-extrabold text-primary">Enter 4 Digit Code</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enter the 4 digit code that you received on your email {email && <>({email})</>}.
        </p>

        <div className="mt-8">
          <OtpInput value={digits} onChange={setDigits} />
        </div>

        <p className="mt-4 text-sm text-muted">
          Email not received?{" "}
          <button type="button" onClick={handleResend} className="font-semibold text-primary">
            Resend code
          </button>
        </p>

        <div className="mt-10">
          <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
            Continue
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
