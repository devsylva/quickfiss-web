"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BackButton } from "@/components/ui/BackButton";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";

import { authApi } from "@/lib/api/auth";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const userId = searchParams.get("userId") ?? email;
  const next = searchParams.get("next") ?? "/reset-password";
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const isValid = digits.every((d) => d !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      await authApi.verifyOtp({
        user_id: userId,
        otp: digits.join(""),
      });
      router.push(next);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Invalid or expired OTP. Please try again.";
      setMessage({
        text: errorMsg,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || isResending) return;
    setIsResending(true);
    setMessage(null);

    try {
      await authApi.resendOtp({ email });
      setMessage({
        text: "A new 4-digit code has been sent to your email address.",
        type: "success",
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to resend code. Please try again.";
      setMessage({
        text: errorMsg,
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <BackButton />

        <h1 className="text-2xl font-extrabold text-primary">Enter 4 Digit Code</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enter the 4 digit code that you received on your email {email && <>({email})</>}.
        </p>

        {message && (
          <div
            className={`mt-4 rounded-xl border p-3 text-xs font-medium ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

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
