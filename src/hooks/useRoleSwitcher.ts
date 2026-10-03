"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Switch between the customer and provider sides of an account. A side the account doesn't have yet
 * (or hasn't onboarded for) sends the user through that side's setup first, so a customer who wants
 * to offer services completes provider onboarding and waits for approval before they can work.
 */
export function useRoleSwitcher() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);

  return (role: "customer" | "provider") => {
    if (role === activeRole) return;
    const hasClient = user?.is_client ?? user?.user_type === "client";
    const hasArtisan = user?.is_artisan ?? user?.user_type === "artisan";

    if (role === "provider") {
      if (!hasArtisan) return router.push("/add-role?role=provider");
      if (user?.provider_status === "draft" || user?.provider_status === "none") {
        return router.push("/provider-onboarding/step-1");
      }
    } else {
      if (!hasClient) return router.push("/add-role?role=customer");
      if (user?.client_onboarding_complete === false) return router.push("/customer-onboarding/step-1");
    }
    setActiveRole(role);
    router.push("/dashboard");
  };
}
