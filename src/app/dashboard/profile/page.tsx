"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Profile, Lock, Notification, ShieldSecurity, LogoutCurve } from "iconsax-react";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth, initAuth } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // Continue clearing local state regardless of server logout response
    } finally {
      clearAuth();
      router.push("/sign-in");
    }
  };

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email.split("@")[0]
    : "Quickfiss User";
  const displayEmail = user?.email || "user@quickfiss.com";
  const initial = displayName.charAt(0).toUpperCase() || "Q";

  return (
    <DashboardShell>
      <div className="px-6 py-6 lg:px-10 lg:py-8 lg:max-w-5xl">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Account Profile</h1>
        <p className="mt-1 text-sm text-muted">Manage your personal information and preferences.</p>

        {/* User Card */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-border/80 bg-zinc-50/60 p-6 sm:flex-row sm:gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-2xl font-extrabold text-primary shadow-xs">
            {initial}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
            <p className="text-xs text-muted">{displayEmail}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {user?.is_verified ? "Verified Account" : "Account Active"}
            </div>
          </div>
        </div>

        {/* Settings Grid on Desktop */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-primary/50 hover:bg-zinc-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Profile size={20} color="#3d5afe" variant="Bold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Personal Information</p>
              <p className="text-xs text-muted">Name, contact details, and default address</p>
            </div>
          </button>

          <button
            type="button"
            className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-primary/50 hover:bg-zinc-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Lock size={20} color="#3d5afe" variant="Bold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Security & Password</p>
              <p className="text-xs text-muted">Update password and enable two-factor auth</p>
            </div>
          </button>

          <button
            type="button"
            className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-primary/50 hover:bg-zinc-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Notification size={20} color="#3d5afe" variant="Bold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <p className="text-xs text-muted">Email, SMS, and booking status alerts</p>
            </div>
          </button>

          <button
            type="button"
            className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-primary/50 hover:bg-zinc-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <ShieldSecurity size={20} color="#3d5afe" variant="Bold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Trust & Verification</p>
              <p className="text-xs text-muted">Government ID and verification status</p>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-8 border-t border-border pt-6">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            <LogoutCurve size={18} color="#dc2626" variant="Linear" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
