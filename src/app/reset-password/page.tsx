"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TickCircle } from "iconsax-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { authApi } from "@/lib/api/auth";
import { RESET_OTP_STORAGE_KEY } from "@/lib/resetFlow";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const codeHref = `/verify-otp?email=${encodeURIComponent(email)}&flow=reset&next=/reset-password`;
  const [apiError, setApiError] = useState<{ text: string; badCode: boolean } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const markTouched = (field: keyof typeof touched) => () => setTouched((t) => ({ ...t, [field]: true }));

  const passwordError = password.length > 0 && password.length < 8 ? "Password must be at least 8 characters" : undefined;
  const confirmPasswordError =
    confirmPassword.length > 0 && confirmPassword !== password ? "Passwords do not match" : undefined;

  const isValid = password.length >= 8 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!isValid || isSubmitting) return;

    let otp: string | null = null;
    try {
      otp = sessionStorage.getItem(RESET_OTP_STORAGE_KEY);
    } catch {
      otp = null;
    }

    if (!email || !otp) {
      setApiError({
        text: "Your reset session has expired. Please request a new code.",
        badCode: false,
      });
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      await authApi.resetPassword({ email, otp, password, password2: confirmPassword });
      try {
        sessionStorage.removeItem(RESET_OTP_STORAGE_KEY);
      } catch {
        // nothing to clean up
      }
      setShowSuccess(true);
    } catch (err: unknown) {
      const text =
        err instanceof Error ? err.message : "Could not reset your password. Please try again.";
      setApiError({ text, badCode: /otp/i.test(text) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <BackButton />

        <h1 className="text-2xl font-extrabold text-primary">Reset password</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Set the new password for your account so you can login and access all the features.
        </p>

        {apiError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {apiError.text}{" "}
            {apiError.badCode ? (
              <Link href={codeHref} className="font-semibold underline">
                Enter the code again
              </Link>
            ) : (
              <Link href="/forgot-password" className="font-semibold underline">
                Start over
              </Link>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-5">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={markTouched("password")}
            error={passwordError}
            touched={touched.password}
            autoComplete="new-password"
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Confirm your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={markTouched("confirmPassword")}
            error={confirmPasswordError}
            touched={touched.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <div className="mt-10">
          <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
            Continue
          </Button>
        </div>
      </form>

      <Modal open={showSuccess}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <TickCircle size={32} color="#3d5afe" variant="Bold" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-foreground">Password Changed!</h2>
        <p className="mt-2 text-sm text-muted">
          You can now use your new password to login to your account.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push("/sign-in")}>Login</Button>
        </div>
      </Modal>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
