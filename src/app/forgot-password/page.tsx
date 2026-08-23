"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isValidEmail } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = !isValidEmail(email) ? "Please enter valid email address" : undefined;
  const isValid = isValidEmail(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    setIsSubmitting(true);
    // TODO: wire up to the real auth API once available.
    router.push(`/verify-otp?email=${encodeURIComponent(email)}&next=/reset-password`);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <BackButton />

        <h1 className="text-2xl font-extrabold text-primary">Forgot password</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enter your email for the verification process. We will send 4 digits code to your email.
        </p>

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
