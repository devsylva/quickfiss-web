"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AppleIcon, GoogleIcon } from "@/components/icons";
import { isValidEmail } from "@/lib/validation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markTouched = (field: keyof typeof touched) => () => setTouched((t) => ({ ...t, [field]: true }));

  const emailError = !isValidEmail(email) ? "Please enter valid email address" : undefined;
  const passwordError = password.length > 0 && password.length < 8 ? "Password must be at least 8 characters" : undefined;
  const confirmPasswordError =
    confirmPassword.length > 0 && confirmPassword !== password ? "Passwords do not match" : undefined;

  const isValid = isValidEmail(email) && password.length >= 8 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });
    if (!isValid) return;
    setIsSubmitting(true);
    // TODO: wire up to the real auth API once available.
    router.push(`/verify-otp?email=${encodeURIComponent(email)}&next=/get-started`);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-extrabold text-primary">Create an account</h1>
        <p className="mt-1 text-sm font-medium text-primary/70">Let&rsquo;s get you started.</p>

        <div className="mt-8 flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={markTouched("email")}
            error={emailError}
            touched={touched.email}
            autoComplete="email"
          />
          <Input
            label="Password"
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
            label="Confirm Password"
            type="password"
            placeholder="Enter your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={markTouched("confirmPassword")}
            error={confirmPasswordError}
            touched={touched.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          By signing up you agree to our{" "}
          <Link href="/terms" className="text-foreground underline">
            Terms
          </Link>
          ,{" "}
          <Link href="/privacy" className="text-foreground underline">
            Privacy Policy
          </Link>
          , and Cookie Use
        </p>

        <div className="mt-6">
          <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
            Create an Account
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-3">
          <Button type="button" variant="oauth">
            <AppleIcon />
            Continue with Apple
          </Button>
          <Button type="button" variant="oauth">
            <GoogleIcon />
            Continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-primary">
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
