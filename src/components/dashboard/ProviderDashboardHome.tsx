"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Location,
  Star1,
  Briefcase,
  Routing,
  TickCircle,
  Clock,
  MoneyRecive,
  ShieldTick,
  CloseCircle,
} from "iconsax-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProviderOnline } from "@/hooks/useProviderOnline";
import { useProviderBookings } from "@/hooks/useProviderBookings";
import { ProviderJobActions } from "@/components/provider/ProviderJobActions";
import { artisansApi } from "@/lib/api/artisans";
import { saveServiceArea } from "@/lib/serviceArea";
import { formatBookingWhen } from "@/lib/formatBooking";
import { formatNaira } from "@/lib/money";
import type { MyProviderProfile } from "@/types/api";
import { ProviderLocationModal } from "./ProviderLocationModal";

export function ProviderDashboardHome() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { isOnline, setOnline, busy: onlineBusy, error: onlineError } = useProviderOnline();
  const { bookings, stats, loading, error, update } = useProviderBookings(true);
  const [profile, setProfile] = useState<MyProviderProfile | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const me = await artisansApi.me();
        if (!cancelled) setProfile(me);
      } catch {
        // the dashboard still works without the profile summary
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const showNotice = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(null), 4000);
  };

  const newRequests = bookings.filter((b) => b.booking_status === "pending");
  const activeJobs = bookings.filter(
    (b) => b.booking_status === "active" || (b.booking_status === "completed" && ["held", "disputed"].includes(b.payment_status)),
  );
  const providerName = user?.first_name || profile?.business_name || "there";
  const completeness = profile?.profile_completeness ?? 0;
  const initials = (user?.first_name || profile?.business_name || "P").charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {notice && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2.5 rounded-xl border border-primary/20 bg-foreground px-4 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 sm:bottom-6 sm:right-6">
          <TickCircle size={18} color="#3d5afe" variant="Bold" />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className="ml-2 text-zinc-400 hover:text-white">
            <CloseCircle size={16} color="currentColor" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary-light text-lg font-bold text-primary ring-2 ring-primary/20 sm:h-14 sm:w-14">
              {user?.profile_picture ? (
                <Image src={user.profile_picture} alt="Your photo" fill sizes="56px" className="object-cover" priority unoptimized />
              ) : (
                initials
              )}
            </div>
            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white transition-colors ${
                isOnline ? "bg-emerald-500" : "bg-zinc-400"
              }`}
            />
          </div>

          <button
            type="button"
            disabled={onlineBusy}
            onClick={() => setOnline(!isOnline)}
            title={isOnline ? "Switch to Offline" : "Switch to Online"}
            className={`relative flex h-7 w-13 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 focus:outline-hidden ${
              isOnline ? "bg-primary" : "bg-zinc-300"
            }`}
          >
            <span
              className={`h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                isOnline ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isOnline ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
              {isOnline ? "Accepting Jobs" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          Hi {providerName}, Ready to work today?
        </h1>
        <p className="mt-1 text-xs text-muted sm:text-sm">
          {isOnline
            ? "You're visible to customers and can receive new requests."
            : "You are currently offline. Turn on your availability to receive job offers."}
        </p>
      </div>

      {onlineError && <p className="mt-2 text-xs text-red-600">{onlineError}</p>}

      {!isOnline && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-900 sm:text-sm">
          <div className="flex items-center gap-2">
            <Clock size={18} color="#b45309" variant="Bold" />
            <span>You&apos;re appearing offline. Customers can&apos;t book you until you go online.</span>
          </div>
          <button
            type="button"
            onClick={() => setOnline(true)}
            className="rounded-lg bg-amber-600 px-3 py-1 font-semibold text-white hover:bg-amber-700"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Total Earned</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MoneyRecive size={16} color="#059669" variant="Bold" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">{formatNaira(stats?.earned ?? 0)}</p>
          <Link href="/dashboard/wallet" className="mt-1 inline-block text-[11px] font-semibold text-emerald-600 hover:underline">
            {formatNaira(stats?.available ?? 0)} ready to withdraw
          </Link>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Active Jobs</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Clock size={16} color="#3d5afe" variant="Bold" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">{stats?.active_jobs ?? 0}</p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-primary">
            {formatNaira(stats?.in_escrow ?? 0)} in escrow
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Client Rating</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Star1 size={16} color="#f59e0b" variant="Bold" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">
            {stats?.rating ? `${stats.rating} ★` : "—"}
          </p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-muted">
            {stats?.review_count ? `From ${stats.review_count} review${stats.review_count === 1 ? "" : "s"}` : "No reviews yet"}
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Acceptance Rate</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <ShieldTick size={16} color="#7c3aed" variant="Bold" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">
            {stats?.acceptance_rate != null ? `${stats.acceptance_rate}%` : "—"}
          </p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-muted">
            {stats?.completed_jobs ?? 0} job{stats?.completed_jobs === 1 ? "" : "s"} completed
          </span>
        </div>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          {/* Quick Actions */}
          <section>
            <h2 className="text-base font-extrabold text-foreground sm:text-lg">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-4">
              <Link href="/dashboard/profile/business" className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xs transition-shadow group-hover:shadow-md sm:h-16 sm:w-16">
                  <svg className="h-14 w-14 -rotate-90 transform sm:h-16 sm:w-16" viewBox="0 0 36 36">
                    <path className="text-zinc-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-primary" strokeDasharray={`${completeness}, 100`} strokeLinecap="round" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-xs font-bold text-primary sm:text-sm">{completeness}%</span>
                </div>
                <span className="mt-2 text-center text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                  Complete<br />profile
                </span>
              </Link>

              <div className="flex flex-col items-center text-center opacity-70" title="Coming soon">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a] shadow-xs sm:h-16 sm:w-16">
                  <Briefcase size={22} color="#16a34a" variant="Bold" />
                </div>
                <span className="mt-2 text-center text-xs font-medium text-foreground">
                  Promote<br />service
                </span>
                <span className="mt-0.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-muted">Soon</span>
              </div>

              <Link
                href={profile ? `/dashboard/provider/${profile.id}` : "/dashboard/profile"}
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffedd5] text-[#ea580c] shadow-xs transition-shadow group-hover:shadow-md sm:h-16 sm:w-16">
                  <Star1 size={22} color="#ea580c" variant="Bold" />
                </div>
                <span className="mt-2 text-center text-xs font-medium text-foreground transition-colors group-hover:text-[#ea580c]">Reviews</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ede9fe] text-[#7c3aed] shadow-xs transition-shadow group-hover:shadow-md sm:h-16 sm:w-16">
                  <Routing size={22} color="#7c3aed" variant="Bold" />
                </div>
                <span className="mt-2 text-center text-xs font-medium text-foreground transition-colors group-hover:text-[#7c3aed]">
                  Set service<br />location
                </span>
              </button>
            </div>
            {profile && profile.profile_missing.length > 0 && (
              <p className="mt-3 text-xs text-muted">
                To finish your profile: {profile.profile_missing.slice(0, 3).join(", ")}
                {profile.profile_missing.length > 3 ? "…" : ""}
              </p>
            )}
          </section>

          {/* Active jobs */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-foreground sm:text-lg">Your Active Jobs</h2>
              <Link href="/dashboard/bookings" className="text-xs font-bold text-primary hover:underline">
                View all ({activeJobs.length})
              </Link>
            </div>

            {loading ? (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-zinc-50 p-5 text-sm text-muted">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading your jobs...
              </div>
            ) : activeJobs.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-zinc-50/70 p-8 text-center">
                <p className="text-sm font-semibold text-foreground">No active jobs right now</p>
                <p className="mt-1 text-xs text-muted">Accept incoming requests from customers to start a new job.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                          {(job.client_name || "C").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground sm:text-base">{job.client_name || "Customer"}</h3>
                          <p className="text-[11px] capitalize text-muted sm:text-xs">{job.service_name || job.service_category}</p>
                        </div>
                      </div>
                      {job.price && <span className="text-sm font-extrabold text-primary">{formatNaira(job.price)}</span>}
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                      <Location size={15} color="#3d5afe" variant="Bold" />
                      <span className="truncate">{job.location}</span>
                      <span className="ml-auto shrink-0 font-medium text-foreground">{formatBookingWhen(job.date, job.time)}</span>
                    </div>
                    <div className="mt-4 border-t border-border/60 pt-3">
                      <ProviderJobActions
                        booking={job}
                        compact
                        onChange={(b) => {
                          update(b);
                          if (b.booking_status === "completed") showNotice("Marked as done. Waiting for the customer to confirm.");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* New requests */}
        <div className="space-y-6 lg:col-span-4">
          <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  {newRequests.length > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />}
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <h2 className="text-base font-extrabold text-foreground">New Job Request</h2>
              </div>
              <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary">{newRequests.length} pending</span>
            </div>

            {newRequests.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                <TickCircle size={32} color="#059669" variant="Bold" />
                <p className="mt-2 text-xs font-bold text-foreground">All caught up!</p>
                <p className="mt-1 text-[11px] text-muted">New requests from customers will appear here.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {newRequests.map((request) => (
                  <div key={request.id} className="rounded-2xl border border-border/80 bg-zinc-50/60 p-4 transition-all hover:border-primary/40 hover:bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-primary">
                          <Briefcase size={20} color="#3d5afe" variant="Bold" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold capitalize text-foreground">{request.service_name || request.service_category}</h3>
                          <p className="text-xs text-muted">{request.client_name || "Customer"}</p>
                        </div>
                      </div>
                      {request.budget && (
                        <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
                          Budget: {formatNaira(request.budget)}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted">
                      <div className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
                        <Location size={15} color="#3d5afe" variant="Bold" />
                        <span className="truncate">{request.location}</span>
                      </div>
                      <span className="shrink-0">{formatBookingWhen(request.date, request.time)}</span>
                    </div>
                    <div className="mt-4 border-t border-border/50 pt-3">
                      <ProviderJobActions
                        booking={request}
                        compact
                        onChange={(b) => {
                          update(b);
                          showNotice(b.booking_status === "active" ? "Quote sent. The customer can now pay." : "Request declined.");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-foreground">Your Availability</h3>
            <p className="mt-1 text-xs text-muted">When customers can book you</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(profile?.availability_data ?? []).length === 0 ? (
                <span className="text-xs text-muted">Not set yet</span>
              ) : (
                profile?.availability_data?.map((slot) => (
                  <span key={slot.name} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-700">
                    {slot.name.toLowerCase()}
                  </span>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/profile/business")}
              className="mt-3 w-full rounded-xl border border-border py-2 text-center text-xs font-semibold text-foreground hover:bg-zinc-50"
            >
              Edit business profile
            </button>
          </section>
        </div>
      </div>

      {isLocationModalOpen && (
        <ProviderLocationModal
          isOpen
          onClose={() => setIsLocationModalOpen(false)}
          initialAddress={profile?.location ?? ""}
          onSaveLocation={async (address, coords) => {
            try {
              await saveServiceArea(address, coords);
              setProfile((p) => (p ? { ...p, location: address } : p));
              showNotice(`Service location updated to "${address}".`);
            } catch (err: unknown) {
              showNotice(err instanceof Error ? err.message : "We couldn't save your location.");
            }
          }}
        />
      )}
    </div>
  );
}
