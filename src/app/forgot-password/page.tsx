"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isValidEmail } from "@/lib/validation";
import { authApi } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const emailError = !isValidEmail(email) ? "Please enter valid email address" : undefined;
  const isValid = isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const trimmed = email.trim();
      await authApi.forgotPassword({ email: trimmed });
      router.push(
        `/verify-otp?email=${encodeURIComponent(trimmed)}&flow=reset&next=/reset-password`
      );
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "Could not send the code. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <BackButton />

        <h1 className="text-2xl font-extrabold text-primary">Forgot password</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enter your email for the verification process. We will send 4 digits code to your email.
        </p>

        {apiError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {apiError}
          </div>
        )}

        <div className="mt-8">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            error={emailError}
            touched={touched}
            autoComplete="email"
          />
        </div>

        <div className="mt-10">
          <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
            Send code
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
