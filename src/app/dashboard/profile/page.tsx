"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Profile,
  Key,
  Heart,
  Location,
  MessageQuestion,
  ShieldTick,
  Notification,
  ShieldSecurity,
  Briefcase,
  ArrowRight2,
  Crown,
  TrendUp,
  Star1,
  Verify,
  Logout,
  Edit2,
} from "iconsax-react";
import { Avatar, ProfileFrame } from "@/components/profile/ProfileFrame";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { CustomerLocationModal } from "@/components/layout/CustomerLocationModal";
import { useMyPlan } from "@/hooks/useMyPlan";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useProviderOnline } from "@/hooks/useProviderOnline";
import { useRoleSwitcher } from "@/hooks/useRoleSwitcher";

const ICON_PROPS = { size: 20, color: "#3d5afe", variant: "Linear" as const };
const ROW_ICON_PROPS = { size: 22, color: "#71717a", variant: "Linear" as const };

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
}

function SettingsCard({ icon, title, description, badge, badgeColor, onClick }: SettingsCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          {icon}
        </div>
        {badge && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              badgeColor || "bg-primary-light text-primary"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
          <ArrowRight2
            size={16}
            color="#71717a"
            variant="Linear"
            className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
          />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">{description}</p>
      </div>
    </button>
  );
}

function MobileRow({
  icon,
  label,
  value,
  badge,
  badgeColor,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 py-3.5 text-left transition-colors hover:bg-zinc-50 px-2 rounded-xl active:bg-zinc-100"
    >
      <div className="shrink-0">{icon}</div>
      <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
      {badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            badgeColor || "bg-primary-light text-primary"
          }`}
        >
          {badge}
        </span>
      )}
      {value && <span className="max-w-[42%] truncate text-xs text-muted">{value}</span>}
      <ArrowRight2 size={16} color="#a1a1aa" variant="Linear" className="shrink-0" />
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth, initAuth, activeRole } = useAuthStore();
  const switchRole = useRoleSwitcher();
  const { isOnline, setOnline, busy: onlineBusy } = useProviderOnline();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [trustOpen, setTrustOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Always refresh user details from server
  useEffect(() => {
    let cancelled = false;
    authApi
      .getMe()
      .then((me) => {
        if (!cancelled) useAuthStore.getState().setUser(me);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError && err.status === 401
            ? "Your session has expired. Please sign in again."
            : "We couldn't refresh your account details.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // Clear local state regardless
    } finally {
      clearAuth();
      router.push("/sign-in");
    }
  };

  const hasArtisan = user?.is_artisan ?? user?.user_type === "artisan";
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const displayName = fullName || user?.email?.split("@")[0] || "Your account";
  const place = user?.address || "";
  const providerLabel: Record<string, string> = {
    approved: "Approved",
    pending: "In review",
    rejected: "Needs changes",
    draft: "Incomplete",
  };

  const isProvider = activeRole === "provider";
  const plan = useMyPlan(isProvider);

  return (
    <ProfileFrame
      title="Account & Profile"
      subtitle="Manage your personal details, credentials, and service settings"
      backHref="/dashboard"
      maxWidth="max-w-md md:max-w-3xl lg:max-w-6xl"
    >
      <FormError message={loadError} signIn={loadError?.includes("sign in")} />

      {/* ========================================================================= */}
      {/* DESKTOP & TABLET VIEW (>= md) */}
      {/* ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-6 lg:gap-8">
        {/* Left Column: Profile Hero & Status Sidebar (Col 1-4) */}
        <aside className="md:col-span-5 lg:col-span-4 space-y-6">
          {/* Main User Card */}
          <div className="flex flex-col items-center rounded-3xl border border-border/80 bg-white p-6 text-center shadow-xs">
            <div className="relative">
              <Avatar src={user?.profile_picture} name={displayName} size={96} />
              <button
                type="button"
                onClick={() => router.push("/dashboard/profile/edit")}
                aria-label="Edit Profile Photo"
                title="Edit profile photo"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-xs transition-transform hover:scale-110"
              >
                <Edit2 size={14} color="#ffffff" variant="Bold" />
              </button>
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-foreground">{displayName}</h2>
            <p className="mt-0.5 text-xs text-muted truncate max-w-full">
              {user?.phone_number ? `${user.phone_number} • ` : ""}
              {user?.email}
            </p>

            {/* Role & Verification Badge */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  isProvider
                    ? "bg-primary-light text-primary"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                }`}
              >
                <Verify size={14} color="currentColor" variant="Bold" />
                {isProvider ? "Verified Provider" : "Verified Customer"}
              </span>

              {user?.state && (
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                  {user.state}
                </span>
              )}
            </div>

            {/* Role Switcher Pill in Profile */}
            <div className="mt-5 w-full rounded-2xl bg-zinc-100 p-1 text-xs">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => switchRole("customer")}
                  className={`flex-1 rounded-xl py-2 font-bold transition-all ${
                    !isProvider
                      ? "bg-white text-foreground shadow-2xs"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => switchRole("provider")}
                  className={`flex-1 rounded-xl py-2 font-bold transition-all ${
                    isProvider
                      ? "bg-primary text-white shadow-2xs"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Provider
                </button>
              </div>
            </div>

            {/* Provider Online / Offline Toggle Card */}
            {isProvider && (
              <div className="mt-4 flex w-full items-center justify-between rounded-2xl border border-border/80 bg-zinc-50/70 p-3.5 text-left">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      isOnline ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-zinc-400"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {isOnline ? "Available for Jobs" : "Offline"}
                    </p>
                    <p className="text-[11px] text-muted">
                      {isOnline ? "Clients can discover & book you" : "You won't receive new job alerts"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={onlineBusy}
                  onClick={() => setOnline(!isOnline)}
                  title={isOnline ? "Go offline" : "Go online"}
                  className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ${
                    isOnline ? "bg-primary" : "bg-zinc-300"
                  } ${onlineBusy ? "opacity-50" : ""}`}
                >
                  <span
                    className={`h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      isOnline ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Provider Subscription Highlight Card */}
            {isProvider && (
              <div className="mt-4 w-full rounded-2xl border border-emerald-200/80 bg-linear-to-br from-emerald-50/80 to-teal-50/50 p-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Crown size={15} color="#ffffff" variant="Bold" />
                    </div>
                    <span className="text-xs font-extrabold text-emerald-950">{plan.label} Plan</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-emerald-900/80">
                  Upgrade for a verified badge, better placement and a lower platform fee.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/subscription")}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-800"
                >
                  <span>Manage Subscription</span>
                  <ArrowRight2 size={13} color="#ffffff" variant="Linear" />
                </button>
              </div>
            )}

            {/* Provider Quick Stats Card */}
            {isProvider && (
              <div className="mt-4 grid w-full grid-cols-3 gap-2 rounded-2xl border border-border/80 bg-zinc-50/60 p-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-foreground">
                    <Star1 size={14} color="#f5b400" variant="Bold" />
                    <span>4.9</span>
                  </div>
                  <span className="text-[10px] text-muted">98 Reviews</span>
                </div>
                <div className="border-x border-border/60 text-center">
                  <p className="text-sm font-extrabold text-foreground">24+</p>
                  <span className="text-[10px] text-muted">Completed</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-extrabold text-emerald-600">96%</p>
                  <span className="text-[10px] text-muted">Acceptance</span>
                </div>
              </div>
            )}

            {/* Customer Quick Stats & Location */}
            {!isProvider && (
              <div className="mt-4 w-full space-y-2">
                <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-zinc-50/70 p-3.5 text-left">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Location size={18} color="#3d5afe" variant="Bold" className="shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground">Service Address</p>
                      <p className="text-[11px] text-muted truncate">
                        {place || "No address set"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocationOpen(true)}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-primary hover:bg-primary-light transition-colors"
                  >
                    Change
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard/profile/saved"
                    className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-zinc-50/60 p-3 transition-colors hover:border-primary/40 hover:bg-white"
                  >
                    <Heart size={18} color="#e11d48" variant="Bold" />
                    <span className="mt-1 text-xs font-bold text-foreground">Saved Artisans</span>
                    <span className="text-[10px] text-muted">View bookmarks</span>
                  </Link>

                  <Link
                    href="/dashboard/bookings"
                    className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-zinc-50/60 p-3 transition-colors hover:border-primary/40 hover:bg-white"
                  >
                    <Briefcase size={18} color="#3d5afe" variant="Bold" />
                    <span className="mt-1 text-xs font-bold text-foreground">My Bookings</span>
                    <span className="text-[10px] text-muted">Track orders</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Logout button */}
            <div className="mt-6 w-full border-t border-border/60 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                <Logout size={16} color="#dc2626" variant="Linear" />
                <span>{isLoggingOut ? "Signing out..." : "Sign out of account"}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Settings & Modules Grid (Col 5-12) */}
        <main className="md:col-span-7 lg:col-span-8 space-y-6">
          {/* Section: Account & Services */}
          <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
            <div className="mb-5">
              <h2 className="text-base font-extrabold text-foreground lg:text-lg">
                {isProvider ? "Provider & Service Management" : "Account & Preferences"}
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                {isProvider
                  ? "Configure your public artisan profile, services, subscription, and job coverage"
                  : "Manage your personal account credentials, saved items, and notifications"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingsCard
                icon={<Profile {...ICON_PROPS} />}
                title="Edit Profile"
                description="Update your full name, phone number, and location details."
                onClick={() => router.push("/dashboard/profile/edit")}
              />

              <SettingsCard
                icon={<Key {...ICON_PROPS} />}
                title="Password & Security"
                description="Update your password and protect your account credentials."
                onClick={() => router.push("/dashboard/profile/password")}
              />

              {isProvider && hasArtisan && (
                <SettingsCard
                  icon={<Briefcase {...ICON_PROPS} />}
                  title="Business Profile"
                  description="Customize services offered, bio, experience, rates, and working hours."
                  badge="Public"
                  badgeColor="bg-emerald-50 text-emerald-700"
                  onClick={() => router.push("/dashboard/profile/business")}
                />
              )}

              {isProvider && (
                <SettingsCard
                  icon={<Crown {...ICON_PROPS} />}
                  title="Subscription Plans"
                  description="Explore Free, Standard, and Premium tiers to unlock higher visibility."
                  badge={`Tier: ${plan.label}`}
                  badgeColor="bg-amber-50 text-amber-800"
                  onClick={() => router.push("/dashboard/subscription")}
                />
              )}

              {isProvider && (
                <SettingsCard
                  icon={<TrendUp {...ICON_PROPS} />}
                  title="Promote Services"
                  description="Boost your listings in client searches to gain more job leads."
                  badge="Featured"
                  badgeColor="bg-blue-50 text-primary"
                  onClick={() => router.push("/dashboard/promote")}
                />
              )}

              {isProvider && (
                <SettingsCard
                  icon={<Location {...ICON_PROPS} />}
                  title="Work Service Area"
                  description={place ? `Coverage: ${place}` : "Set and calibrate your active service address and radius."}
                  onClick={() => router.push("/dashboard/location")}
                />
              )}

              {!isProvider && (
                <SettingsCard
                  icon={<Heart {...ICON_PROPS} />}
                  title="Saved Artisans"
                  description="View and book services with your favorite saved artisans."
                  onClick={() => router.push("/dashboard/profile/saved")}
                />
              )}

              {!isProvider && (
                <SettingsCard
                  icon={<Location {...ICON_PROPS} />}
                  title="Service Address"
                  description={place || "Set your home or business service location."}
                  onClick={() => setLocationOpen(true)}
                />
              )}

              <SettingsCard
                icon={<Notification {...ICON_PROPS} />}
                title="Notifications"
                description="Manage your push notifications, job alerts, and message preferences."
                onClick={() => router.push("/dashboard/notifications")}
              />
            </div>
          </div>

          {/* Section: Trust & Verification */}
          <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-foreground lg:text-lg">
                  Trust &amp; Verification
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Keep your identity and platform trust level in good standing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTrustOpen(true)}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-zinc-50"
              >
                View Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-zinc-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-border/70 text-foreground">
                    <ShieldSecurity size={20} color="#3d5afe" variant="Linear" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">Email Status</h3>
                    <p className="text-[11px] text-muted">{user?.email}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    user?.is_verified
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {user?.is_verified ? "Verified" : "Unverified"}
                </span>
              </div>

              {hasArtisan && (
                <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-zinc-50/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-border/70 text-foreground">
                      <ShieldTick size={20} color="#3d5afe" variant="Linear" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Artisan ID Check</h3>
                      <p className="text-[11px] text-muted">Government ID &amp; KYC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                        user?.provider_status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : user?.provider_status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {providerLabel[user?.provider_status ?? ""] ?? "Not submitted"}
                    </span>
                    {(user?.provider_status === "rejected" || user?.provider_status === "draft") && (
                      <button
                        type="button"
                        onClick={() => router.push("/provider-onboarding/step-1")}
                        className="block mt-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        Update details
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Support & Policies */}
          <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-foreground lg:text-lg">Support &amp; Policies</h2>
              <p className="mt-0.5 text-xs text-muted">Help resources and legal documentation</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <button
                type="button"
                onClick={() => router.push("/contact")}
                className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-zinc-50/50 p-4 text-left transition-all hover:bg-white hover:border-primary/40 hover:shadow-xs"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MessageQuestion size={18} color="currentColor" variant="Linear" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary">Support &amp; Feedback</p>
                  <p className="mt-0.5 text-[11px] text-muted">Get assistance from our team</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/privacy")}
                className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-zinc-50/50 p-4 text-left transition-all hover:bg-white hover:border-primary/40 hover:shadow-xs"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ShieldTick size={18} color="currentColor" variant="Linear" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary">Privacy Center</p>
                  <p className="mt-0.5 text-[11px] text-muted">Control your personal data</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/terms")}
                className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-zinc-50/50 p-4 text-left transition-all hover:bg-white hover:border-primary/40 hover:shadow-xs"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ShieldSecurity size={18} color="currentColor" variant="Linear" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary">Terms of Service</p>
                  <p className="mt-0.5 text-[11px] text-muted">Platform guidelines &amp; rules</p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE VIEW (< md) */}
      {/* ========================================================================= */}
      <div className="md:hidden pb-10">
        {/* Mobile Profile Header Card */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar src={user?.profile_picture} name={displayName} size={84} />
            <button
              type="button"
              onClick={() => router.push("/dashboard/profile/edit")}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-xs"
              aria-label="Edit Profile"
            >
              <Edit2 size={12} color="#ffffff" variant="Bold" />
            </button>
          </div>

          <h2 className="mt-3 text-lg font-bold text-foreground">{displayName}</h2>
          <p className="text-xs text-muted truncate max-w-[280px]">
            {user?.phone_number || user?.email}
          </p>

          {/* Role pill & Online Switch for Mobile */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                isProvider ? "bg-primary-light text-primary" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {isProvider ? "Provider Account" : "Customer Account"}
            </span>

            {isProvider && (
              <button
                type="button"
                disabled={onlineBusy}
                onClick={() => setOnline(!isOnline)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border transition-colors ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-zinc-100 text-zinc-600 border-border"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-zinc-400"}`}
                />
                <span>{isOnline ? "Online" : "Offline"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Provider Subscription Banner */}
        {isProvider && (
          <button
            type="button"
            onClick={() => router.push("/dashboard/subscription")}
            className="mt-5 flex w-full items-center justify-between rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-3.5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Crown size={18} color="#ffffff" variant="Bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-950">{plan.label} Subscription</span>
                  <span className="rounded-full bg-emerald-200/70 px-1.5 py-0.2 text-[9px] font-bold text-emerald-900">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/80">Verified badge, better placement, lower fee</p>
              </div>
            </div>
            <ArrowRight2 size={16} color="#047857" variant="Linear" />
          </button>
        )}

        {/* Mobile Section: Account */}
        <p className="mt-6 mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Account
        </p>
        <div className="divide-y divide-border/60 rounded-2xl bg-white border border-border/80 px-2 py-1 shadow-2xs">
          <MobileRow
            icon={<Profile {...ROW_ICON_PROPS} />}
            label="Edit Profile"
            onClick={() => router.push("/dashboard/profile/edit")}
          />
          <MobileRow
            icon={<Key {...ROW_ICON_PROPS} />}
            label="Change Password"
            onClick={() => router.push("/dashboard/profile/password")}
          />

          {isProvider && hasArtisan && (
            <MobileRow
              icon={<Briefcase {...ROW_ICON_PROPS} />}
              label="Business profile"
              badge="Services & Bio"
              onClick={() => router.push("/dashboard/profile/business")}
            />
          )}

          {isProvider && (
            <MobileRow
              icon={<Crown {...ROW_ICON_PROPS} />}
              label="Subscription Plans"
              value={`${plan.label} Plan`}
              onClick={() => router.push("/dashboard/subscription")}
            />
          )}

          {isProvider && (
            <MobileRow
              icon={<TrendUp {...ROW_ICON_PROPS} />}
              label="Promote Services"
              badge="Boost"
              badgeColor="bg-blue-50 text-primary"
              onClick={() => router.push("/dashboard/promote")}
            />
          )}

          {!isProvider && (
            <MobileRow
              icon={<Heart {...ROW_ICON_PROPS} />}
              label="Saved Artisans"
              onClick={() => router.push("/dashboard/profile/saved")}
            />
          )}

          <MobileRow
            icon={<Location {...ROW_ICON_PROPS} />}
            label={isProvider ? "Work Service Area" : "Location"}
            value={place}
            onClick={() =>
              isProvider ? router.push("/dashboard/location") : setLocationOpen(true)
            }
          />

          <MobileRow
            icon={<Notification {...ROW_ICON_PROPS} />}
            label="Notifications"
            onClick={() => router.push("/dashboard/notifications")}
          />
        </div>

        {/* Mobile Section: Trust & Help */}
        <p className="mt-6 mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Trust &amp; Help
        </p>
        <div className="divide-y divide-border/60 rounded-2xl bg-white border border-border/80 px-2 py-1 shadow-2xs">
          <MobileRow
            icon={<ShieldSecurity {...ROW_ICON_PROPS} />}
            label="Trust & Verification"
            badge={user?.is_verified ? "Verified" : "Action"}
            badgeColor={user?.is_verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}
            onClick={() => setTrustOpen(true)}
          />
          <MobileRow
            icon={<MessageQuestion {...ROW_ICON_PROPS} />}
            label="Support and Feedback"
            onClick={() => router.push("/contact")}
          />
          <MobileRow
            icon={<ShieldTick {...ROW_ICON_PROPS} />}
            label="Privacy Center"
            onClick={() => router.push("/privacy")}
          />
        </div>

        {/* Mobile Logout Button */}
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-6 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
          >
            <Logout size={16} color="#dc2626" variant="Linear" />
            <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </div>

      {/* Customer Location Modal */}
      {locationOpen && (
        <CustomerLocationModal
          open
          initialAddress={place}
          onClose={() => setLocationOpen(false)}
          onSaved={(address) => user && useAuthStore.getState().setUser({ ...user, address })}
        />
      )}

      {/* Trust & Verification Modal */}
      <Modal open={trustOpen}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
            <ShieldTick size={20} color="#3d5afe" variant="Bold" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Trust &amp; Verification</h2>
        </div>

        <ul className="mt-4 flex flex-col gap-3 text-left text-sm">
          <li className="flex items-center justify-between rounded-xl bg-zinc-50 p-3.5 border border-border/60">
            <div>
              <span className="font-semibold text-foreground">Email Verification</span>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                user?.is_verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {user?.is_verified ? "Verified" : "Not verified"}
            </span>
          </li>

          {hasArtisan && (
            <li className="rounded-xl bg-zinc-50 p-3.5 border border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground">Provider ID Verification</span>
                  <p className="text-xs text-muted">Government ID &amp; background check</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    user?.provider_status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : user?.provider_status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {providerLabel[user?.provider_status ?? ""] ?? "Not submitted"}
                </span>
              </div>
              {user?.provider_status === "rejected" && user.provider_rejection_reason && (
                <p className="mt-2.5 rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
                  {user.provider_rejection_reason}
                </p>
              )}
              {(user?.provider_status === "rejected" || user?.provider_status === "draft") && (
                <button
                  type="button"
                  onClick={() => {
                    setTrustOpen(false);
                    router.push("/provider-onboarding/step-1");
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Update verification details</span>
                  <ArrowRight2 size={12} color="#3d5afe" variant="Linear" />
                </button>
              )}
            </li>
          )}
        </ul>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={() => setTrustOpen(false)} className="!w-auto !px-6">
            Close
          </Button>
        </div>
      </Modal>
    </ProfileFrame>
  );
}
