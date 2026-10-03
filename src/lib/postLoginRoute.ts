import type { User } from "@/types/api";

/** Where a user belongs right after signing in, based on how far they got last time. */
export function routeAfterSignIn(user: User): string {
  if (user.is_verified === false) {
    const params = new URLSearchParams({ email: user.email, userId: String(user.id), next: "/get-started" });
    return `/verify-otp?${params.toString()}`;
  }
  if (user.user_type !== "client" && user.user_type !== "artisan") return "/choose-role";
  if (!user.onboarding_complete) {
    return user.user_type === "artisan" ? "/provider-onboarding/step-1" : "/customer-onboarding/step-1";
  }
  return "/dashboard";
}

/** The dashboard view that matches the account's type. */
export const roleForUser = (user: User): "customer" | "provider" =>
  user.user_type === "artisan" ? "provider" : "customer";
