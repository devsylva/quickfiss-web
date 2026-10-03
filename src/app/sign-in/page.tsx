"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AppleIcon, GoogleIcon } from "@/components/icons";
import { isValidEmail } from "@/lib/validation";

import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { roleForUser, routeAfterSignIn } from "@/lib/postLoginRoute";

export default function SignInPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const markTouched = (field: keyof typeof touched) => () => setTouched((t) => ({ ...t, [field]: true }));

  const emailError = !isValidEmail(email) ? "Please enter valid email address" : undefined;
  const isValid = isValidEmail(email) && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await authApi.login({ email, password });
      setAuth(response);

      // Login only returns tokens; load who this is so the app knows their name, role and progress.
      let user;
      try {
        user = await authApi.getMe();
      } catch {
        clearAuth();
        setApiError("You're signed in, but we couldn't load your account. Please try again.");
        return;
      }
      setUser(user);
      if (user.user_type === "client" || user.user_type === "artisan") setActiveRole(roleForUser(user));
      router.push(routeAfterSignIn(user));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Invalid email or password. Please try again.";
      setApiError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-extrabold text-primary">Login to your account</h1>
        <p className="mt-1 text-sm font-medium text-primary/70">Great to see you again. 👋</p>

        {apiError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {apiError}
          </div>
        )}

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
            autoComplete="current-password"
          />
        </div>

        <p className="mt-4 text-sm text-muted">
          Forgot your password?{" "}
          <Link href="/forgot-password" className="font-semibold text-foreground">
            Reset your password
          </Link>
        </p>

        <div className="mt-6">
          <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
            Login
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-3">
          <Button type="button" variant="oauth">
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button type="button" variant="oauth">
            <AppleIcon />
            Continue with Apple
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Don&rsquo;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-primary">
            Signup
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
