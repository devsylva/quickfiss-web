"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TickCircle } from "iconsax-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function ResetPasswordPage() {
  const router = useRouter();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!isValid) return;
    setIsSubmitting(true);
    // TODO: wire up to the real auth API once available.
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <BackButton />

        <h1 className="text-2xl font-extrabold text-primary">Reset password</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Set the new password for your account so you can login and access all the features.
        </p>

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
