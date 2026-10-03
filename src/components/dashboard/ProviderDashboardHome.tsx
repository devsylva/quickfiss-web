"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Location,
  Sms,
  Star1,
  Notification,
  Briefcase,
  Routing,
  TickCircle,
  Clock,
  MoneyRecive,
  ShieldTick,
  CloseCircle,
} from "iconsax-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ProviderLocationModal } from "./ProviderLocationModal";

interface ActiveJob {
  id: string;
  customerName: string;
  customerAvatar: string;
  serviceTitle: string;
  status: "In progress" | "On the way";
  tags: string[];
  distance: string;
  scheduledTime: string;
  budget: string;
}

interface NewJobRequest {
  id: string;
  title: string;
  category: string;
  budget: string;
  distance: string;
  customerName: string;
  customerAvatar: string;
  address: string;
  timeSlot: string;
  tags: string[];
  notes?: string;
}

const initialActiveJobs: ActiveJob[] = [
  {
    id: "job-1",
    customerName: "Sarah Johnson",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    serviceTitle: "Plumbing repair",
    status: "In progress",
    tags: ["Plumbing repair", "Kitchen Sink", "Pipe Issue"],
    distance: "2.5 miles away",
    scheduledTime: "10:00 AM - 12:00 PM",
    budget: "$120",
  },
  {
    id: "job-2",
    customerName: "Sarah Johnson",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    serviceTitle: "Plumbing repair",
    status: "In progress",
    tags: ["Plumbing repair", "Kitchen Sink", "Pipe Issue"],
    distance: "2.5 miles away",
    scheduledTime: "2:00 PM - 4:00 PM",
    budget: "$95",
  },
];

const initialNewRequests: NewJobRequest[] = [
  {
    id: "req-1",
    title: "Bathroom Cleaning",
    category: "Cleaning",
    budget: "$85",
    distance: "6 miles away",
    customerName: "Robert West",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    address: "1234 Maple Street, Ikeja",
    timeSlot: "8:00 - 9:00 AM, Today",
    tags: ["Deep Cleaning", "Sanitization"],
    notes: "Bathroom tiles need scrubbing and drainage unclogging.",
  },
  {
    id: "req-2",
    title: "AC Installation & Checkup",
    category: "AC Repair",
    budget: "$150",
    distance: "3.2 miles away",
    customerName: "David Miller",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    address: "45 Admiralty Way, Lekki",
    timeSlot: "4:00 - 5:30 PM, Today",
    tags: ["AC Installation", "Thermostat Issue"],
    notes: "AC making strange buzzing noise and not cooling properly.",
  },
];

export function ProviderDashboardHome() {
  const router = useRouter();
  const { user, isOnline, setIsOnline } = useAuthStore();
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>(initialActiveJobs);
  const [newRequests, setNewRequests] = useState<NewJobRequest[]>(initialNewRequests);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [serviceLocation, setServiceLocation] = useState("267 Opebi Road, Ikeja");

  const providerName =
    user?.first_name ||
    "Alexis";

  const handleAcceptRequest = (request: NewJobRequest) => {
    setNewRequests((prev) => prev.filter((r) => r.id !== request.id));
    const newActiveJob: ActiveJob = {
      id: `active-${request.id}`,
      customerName: request.customerName,
      customerAvatar: request.customerAvatar,
      serviceTitle: request.title,
      status: "In progress",
      tags: [request.title, ...request.tags],
      distance: request.distance,
      scheduledTime: request.timeSlot,
      budget: request.budget,
    };
    setActiveJobs((prev) => [newActiveJob, ...prev]);
    setBannerNotice(`Accepted request from ${request.customerName}! Added to your active jobs.`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleDeclineRequest = (id: string, customerName: string) => {
    setNewRequests((prev) => prev.filter((r) => r.id !== id));
    setBannerNotice(`Declined request from ${customerName}.`);
    setTimeout(() => setBannerNotice(null), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Interactive Toast Notification */}
      {bannerNotice && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2.5 rounded-xl border border-primary/20 bg-foreground px-4 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 sm:bottom-6 sm:right-6">
          <TickCircle size={18} color="#3d5afe" variant="Bold" />
          <span>{bannerNotice}</span>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <CloseCircle size={16} color="currentColor" />
          </button>
        </div>
      )}

      {/* Header Section (Mobile & Desktop) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20 sm:h-14 sm:w-14">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Provider Avatar"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            </div>
            {/* Green / Gray dot */}
            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white transition-colors ${
                isOnline ? "bg-emerald-500" : "bg-zinc-400"
              }`}
            />
          </div>

          {/* Toggle Switch Pill */}
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
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

        {/* Right side notification bell & status */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isOnline
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                }`}
              />
              {isOnline ? "Accepting Jobs" : "Offline"}
            </span>
          </div>

          <button
            type="button"
            aria-label="Provider Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-zinc-50"
          >
            <Notification size={20} color="#18181b" variant="Linear" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Greeting Title */}
      <div className="mt-4">
        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          Hi {providerName}, Ready to work today?
        </h1>
        <p className="mt-1 text-xs text-muted sm:text-sm">
          {isOnline
            ? "You're visible to customers searching in your service radius."
            : "You are currently offline. Turn on your availability to receive job offers."}
        </p>
      </div>

      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-900 sm:text-sm">
          <div className="flex items-center gap-2">
            <Clock size={18} color="#b45309" variant="Bold" />
            <span>You&apos;re currently appearing offline. Clients cannot send instant bookings.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOnline(true)}
            className="rounded-lg bg-amber-600 px-3 py-1 font-semibold text-white hover:bg-amber-700"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Desktop / Tablet Performance Metrics Row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Today&apos;s Earnings</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MoneyRecive size={16} color="#059669" variant="Bold" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">$250.00</p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-emerald-600">
            +12% vs yesterday
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Active Jobs</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Clock size={16} color="#3d5afe" variant="Bold" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">{activeJobs.length}</p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-primary">
            In progress now
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Client Rating</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Star1 size={16} color="#f59e0b" variant="Bold" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">4.9 ★</p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-muted">
            From 98 reviews
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Acceptance Rate</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <ShieldTick size={16} color="#7c3aed" variant="Bold" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">96%</p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-emerald-600">
            Top provider badge
          </span>
        </div>
      </div>

      {/* Main Grid: Responsive 2-column on desktop / tablet */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column (8 cols on lg): Quick Actions & Active Jobs */}
        <div className="space-y-8 lg:col-span-8">
          {/* Quick Actions (Matching Figma Image 1) */}
          <section>
            <h2 className="text-base font-extrabold text-foreground sm:text-lg">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-4">
              {/* Action 1: Complete profile with 60% circular progress ring */}
              <Link
                href="/dashboard/profile"
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5"
              >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xs transition-shadow group-hover:shadow-md sm:h-16 sm:w-16">
                  {/* Circular SVG Ring */}
                  <svg className="h-14 w-14 -rotate-90 transform sm:h-16 sm:w-16" viewBox="0 0 36 36">
                    <path
                      className="text-zinc-100"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary"
                      strokeDasharray="60, 100"
                      strokeLinecap="round"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-primary sm:text-sm">60%</span>
                </div>
                <span className="mt-2 text-center text-xs font-medium text-foreground transition-colors group-hover:text-primary sm:text-xs">
                  Complete<br />profile
                </span>
              </Link>

              {/* Action 2: Promote service (Green circular bg) */}
              <Link
                href="/dashboard/promote"
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a] shadow-xs transition-shadow group-hover:shadow-md sm:h-16 sm:w-16">
                  <Briefcase size={22} color="#16a34a" variant="Bold" />
                </div>
                <span className="mt-2 text-center text-xs font-medium text-foreground transition-colors group-hover:text-[#16a34a] sm:text-xs">
                  Promote<br />service
                </span>
              </Link>

              {/* Action 3: Reviews (Peach/orange circular bg) */}
              <Link
                href="/dashboard/profile"
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffedd5] text-[#ea580c] shadow-xs transition-shadow group-hover:shadow-md sm:h-16 sm:w-16">
                  <Star1 size={22} color="#ea580c" variant="Bold" />
                </div>
                <span className="mt-2 text-center text-xs font-medium text-foreground transition-colors group-hover:text-[#ea580c] sm:text-xs">
                  Reviews
                </span>
              </Link>

              {/* Action 4: Set service location (Lavender/blue circular bg) */}
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ede9fe] text-[#7c3aed] shadow-xs transition-shadow group-hover:shadow-md sm:h-16 sm:w-16">
                  <Routing size={22} color="#7c3aed" variant="Bold" />
                </div>
                <span className="mt-2 text-center text-xs font-medium text-foreground transition-colors group-hover:text-[#7c3aed] sm:text-xs">
                  Set service<br />location
                </span>
              </button>
            </div>
          </section>

          {/* Your Active Jobs (Matching Figma Image 1) */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-foreground sm:text-lg">Your Active Jobs</h2>
              <Link
                href="/dashboard/bookings"
                className="text-xs font-bold text-primary hover:underline"
              >
                View all ({activeJobs.length})
              </Link>
            </div>

            {activeJobs.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-zinc-50/70 p-8 text-center">
                <p className="text-sm font-semibold text-foreground">No active jobs right now</p>
                <p className="mt-1 text-xs text-muted">
                  Accept incoming requests from customers to start a new job.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="group rounded-2xl border border-border/80 bg-white p-4 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs sm:p-5"
                  >
                    {/* Top Row: Customer Avatar, Name & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border">
                          <Image
                            src={job.customerAvatar}
                            alt={job.customerName}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground sm:text-base">
                            {job.customerName}
                          </h3>
                          <p className="text-[11px] text-muted sm:text-xs">{job.serviceTitle}</p>
                        </div>
                      </div>

                      {/* Status badge: In progress */}
                      <span className="rounded-full bg-[#e8f5e9] px-3 py-1 text-xs font-semibold text-[#2e7d32]">
                        {job.status}
                      </span>
                    </div>

                    {/* Middle Row: Tag Pills */}
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Row: Location & Message Button */}
                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Location size={16} color="#3d5afe" variant="Bold" />
                        <span>{job.distance}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => router.push("/dashboard/chats")}
                        className="flex items-center gap-1.5 rounded-xl bg-primary-light px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/20 active:scale-95"
                      >
                        <Sms size={16} color="#3d5afe" variant="Bold" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column (4 cols on lg): New Job Requests & Live Assist */}
        <div className="space-y-6 lg:col-span-4">
          {/* New Job Request Section (Matching Figma Image 1) */}
          <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <h2 className="text-base font-extrabold text-foreground">New Job Request</h2>
              </div>
              <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary">
                {newRequests.length} pending
              </span>
            </div>

            {newRequests.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                <TickCircle size={32} color="#059669" variant="Bold" />
                <p className="mt-2 text-xs font-bold text-foreground">All caught up!</p>
                <p className="mt-1 text-[11px] text-muted">
                  New incoming requests will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {newRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-border/80 bg-zinc-50/60 p-4 transition-all hover:border-primary/40 hover:bg-white sm:p-4.5"
                  >
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-primary">
                          <Briefcase size={20} color="#3d5afe" variant="Bold" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{request.title}</h3>
                          <p className="text-xs text-muted">{request.customerName}</p>
                        </div>
                      </div>

                      {/* Budget Pill */}
                      <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
                        Budget: {request.budget}
                      </span>
                    </div>

                    {/* Distance and time */}
                    <div className="mt-3 flex items-center justify-between text-xs text-muted">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <Location size={15} color="#3d5afe" variant="Bold" />
                        <span>{request.distance}</span>
                      </div>
                      <span>{request.timeSlot}</span>
                    </div>

                    {/* Action Buttons: Accept & Decline */}
                    <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-border/50 pt-3">
                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(request)}
                        className="rounded-xl bg-primary-light px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white active:scale-95"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeclineRequest(request.id, request.customerName)}
                        className="rounded-xl bg-[#ffedd5] px-4 py-2 text-xs font-bold text-[#9a3412] transition-all hover:bg-orange-200 active:scale-95"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Schedule Overview widget on Desktop / Tablet */}
          <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-foreground">Today&apos;s Working Hours</h3>
            <p className="mt-1 text-xs text-muted">Standard daily availability</p>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-50 p-3 text-xs">
              <span className="font-semibold text-foreground">08:00 AM - 07:00 PM</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/profile")}
              className="mt-3 w-full rounded-xl border border-border py-2 text-center text-xs font-semibold text-foreground hover:bg-zinc-50"
            >
              Adjust Working Hours
            </button>
          </section>
        </div>
      </div>

      {/* Provider Set Location Modal / Screen */}
      <ProviderLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        initialAddress={serviceLocation}
        onSaveLocation={(newAddress) => {
          setServiceLocation(newAddress);
          setBannerNotice(`Service location updated to "${newAddress}"!`);
          setTimeout(() => setBannerNotice(null), 4000);
        }}
      />
    </div>
  );
}
