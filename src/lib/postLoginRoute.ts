import type { User } from "@/types/api";

type Role = "customer" | "provider";

const hasClient = (user: User) => user.is_client ?? user.user_type === "client";
const hasArtisan = (user: User) => user.is_artisan ?? user.user_type === "artisan";

/** The side of the app to open: the one last used if the account has it, otherwise the one it does have. */
export function roleForUser(user: User, preferred?: Role | null): Role {
  if (preferred === "provider" && hasArtisan(user)) return "provider";
  if (preferred === "customer" && hasClient(user)) return "customer";
  return hasClient(user) ? "customer" : "provider";
}

/** Whether the account has finished onboarding for this side. */
export function onboardedFor(user: User, role: Role): boolean {
  if (role === "provider") return user.provider_onboarding_complete ?? Boolean(user.onboarding_complete);
  return user.client_onboarding_complete ?? Boolean(user.onboarding_complete);
}

/** Where a user belongs right after signing in, based on how far they got last time. */
export function routeAfterSignIn(user: User, preferred?: Role | null): string {
  if (user.is_verified === false) {
    const params = new URLSearchParams({ email: user.email, userId: String(user.id), next: "/get-started" });
    return `/verify-otp?${params.toString()}`;
  }
  if (!hasClient(user) && !hasArtisan(user)) return "/choose-role";
  const role = roleForUser(user, preferred);
  if (!onboardedFor(user, role)) {
    return role === "provider" ? "/provider-onboarding/step-1" : "/customer-onboarding/step-1";
  }
  return "/dashboard";
}
