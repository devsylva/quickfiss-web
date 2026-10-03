"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Location,
  Sms,
  Star1,
  CloseCircle,
  TickCircle,
  Clock,
  DirectRight,
} from "iconsax-react";

export type ProviderBookingTab = "new" | "active" | "completed";

export interface BookingRequestItem {
  id: string;
  serviceTitle: string;
  category: string;
  iconBg: string;
  iconColor: string;
  iconEmoji: string;
  budget: string;
  tags: string[];
  schedule: string;
  customerName: string;
  customerAvatar: string;
  customerRating: number;
  distance: string;
  address: string;
  dateFull: string;
  customerNote: string;
  images: string[];
}

export interface CompletedBookingItem {
  id: string;
  customerName: string;
  customerAvatar: string;
  serviceTitle: string;
  date: string;
  rating: number;
  amount: string;
}

const initialNewRequests: BookingRequestItem[] = [
  {
    id: "req-ac-1",
    serviceTitle: "AC Installation",
    category: "Appliances",
    iconBg: "bg-[#ffedd5]",
    iconColor: "text-[#ea580c]",
    iconEmoji: "❄️",
    budget: "$85",
    tags: ["Thermostat Issue", "Strange Noise"],
    schedule: "8:00-9:00 AM, 09 Dec",
    customerName: "Robert West",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    customerRating: 4.5,
    distance: "6 miles away",
    address: "1234 Maple Street, Ikeja",
    dateFull: "09 Dec, 2025 at 10:14am",
    customerNote:
      "My Air Conditioner is not cooling properly. Strange noise coming from the unit. Seems like it might need a thorough inspection.",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80",
    ],
  },
  {
    id: "req-dryer-2",
    serviceTitle: "Hair Dryer Repair",
    category: "Appliances",
    iconBg: "bg-[#ede9fe]",
    iconColor: "text-[#7c3aed]",
    iconEmoji: "🔌",
    budget: "$85",
    tags: ["Thermostat Issue", "Strange Noise"],
    schedule: "8:00-9:00 AM, 09 Dec",
    customerName: "Robert West",
    customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    customerRating: 4.5,
    distance: "6 miles away",
    address: "1234 Maple Street, Ikeja",
    dateFull: "09 Dec, 2025 at 10:14am",
    customerNote:
      "The hair dryer cuts off automatically after two minutes of use. Likely an overheating thermostat issue.",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80",
    ],
  },
];

const initialActiveBookings: BookingRequestItem[] = [
  {
    id: "active-plumb-1",
    serviceTitle: "Kitchen Sink Plumbing",
    category: "Plumbing",
    iconBg: "bg-[#dbeafe]",
    iconColor: "text-primary",
    iconEmoji: "🔧",
    budget: "$120",
    tags: ["Kitchen Sink", "Pipe Issue"],
    schedule: "11:00 AM - 1:00 PM, Today",
    customerName: "Sarah Johnson",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    customerRating: 5.0,
    distance: "2.5 miles away",
    address: "24 Victoria Island, Lagos",
    dateFull: "Today at 11:00am",
    customerNote: "Water is leaking under the kitchen sink trap valve.",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80",
    ],
  },
];

const initialCompletedList: CompletedBookingItem[] = [
  {
    id: "comp-1",
    customerName: "Robert West",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    serviceTitle: "Ac repair and Installation",
    date: "09 Dec, 2025 at 10:14am",
    rating: 4.5,
    amount: "$250",
  },
  {
    id: "comp-2",
    customerName: "Robert West",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    serviceTitle: "Ac repair and Installation",
    date: "09 Dec, 2025 at 10:14am",
    rating: 4.5,
    amount: "$250",
  },
  {
    id: "comp-3",
    customerName: "Robert West",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    serviceTitle: "Ac repair and Installation",
    date: "09 Dec, 2025 at 10:14am",
    rating: 4.5,
    amount: "$250",
  },
  {
    id: "comp-4",
    customerName: "Robert West",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    serviceTitle: "Ac repair and Installation",
    date: "09 Dec, 2025 at 10:14am",
    rating: 4.5,
    amount: "$250",
  },
  {
    id: "comp-5",
    customerName: "Robert West",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    serviceTitle: "Ac repair and Installation",
    date: "09 Dec, 2025 at 10:14am",
    rating: 4.5,
    amount: "$250",
  },
];

export function ProviderBookingsView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProviderBookingTab>("new");
  const [newRequests, setNewRequests] = useState<BookingRequestItem[]>(initialNewRequests);
  const [activeBookings, setActiveBookings] = useState<BookingRequestItem[]>(initialActiveBookings);
  const [completedList] = useState<CompletedBookingItem[]>(initialCompletedList);

  // Modal State for Booking Request details (Mockup 4)
  const [selectedRequest, setSelectedRequest] = useState<BookingRequestItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleAccept = (item: BookingRequestItem) => {
    setNewRequests((prev) => prev.filter((r) => r.id !== item.id));
    setActiveBookings((prev) => [item, ...prev]);
    setSelectedRequest(null);
    showToast(`Accepted booking for ${item.serviceTitle}!`);
  };

  const handleDecline = (id: string, name: string) => {
    setNewRequests((prev) => prev.filter((r) => r.id !== id));
    setSelectedRequest(null);
    showToast(`Declined request from ${name}.`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm text-white shadow-xl sm:bottom-6 sm:right-6">
          <TickCircle size={18} color="#3d5afe" variant="Bold" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Title with Purple accent bar (Matching Figma) */}
      <div className="flex items-center gap-3">
        <span className="h-7 w-1.5 rounded-full bg-primary" />
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Bookings
        </h1>
      </div>

      {/* Tabs Row (Matching Figma Mockup 2 & 3) */}
      <div className="mt-6 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("new")}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
            activeTab === "new"
              ? "bg-primary-light text-primary shadow-xs"
              : "text-muted hover:bg-zinc-100 hover:text-foreground"
          }`}
        >
          New Requests {newRequests.length > 0 && `(${newRequests.length})`}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
            activeTab === "active"
              ? "bg-primary-light text-primary shadow-xs"
              : "text-muted hover:bg-zinc-100 hover:text-foreground"
          }`}
        >
          Active {activeBookings.length > 0 && `(${activeBookings.length})`}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
            activeTab === "completed"
              ? "bg-primary-light text-primary shadow-xs"
              : "text-muted hover:bg-zinc-100 hover:text-foreground"
          }`}
        >
          Completed
        </button>
      </div>

      {/* TAB CONTENT: NEW REQUESTS */}
      {activeTab === "new" && (
        <div className="mt-6">
          {newRequests.length === 0 ? (
            /* Empty State matching Image 5 */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-white px-6 py-16 text-center sm:py-24">
              {/* Illustrated Empty Box SVG */}
              <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-primary-light/40">
                <svg
                  className="h-28 w-28 text-primary/70"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Tray / Box */}
                  <rect x="25" y="45" width="70" height="50" rx="12" fill="#E8EAFB" stroke="#93A2FA" strokeWidth="2.5" />
                  <path d="M25 65 H46 C48 65 50 68 52 70 C54 72 58 74 60 74 C62 74 66 72 68 70 C70 68 72 65 74 65 H95" stroke="#93A2FA" strokeWidth="2.5" fill="none" />
                  {/* Dots for eyes */}
                  <circle cx="50" cy="80" r="2.5" fill="#3D5AFE" />
                  <circle cx="70" cy="80" r="2.5" fill="#3D5AFE" />
                  <rect x="56" y="87" width="8" height="2.5" rx="1.25" fill="#3D5AFE" />
                  {/* Flight trail loop */}
                  <path
                    d="M60 25 C65 25 72 32 68 38 C64 44 54 40 58 48 C60 52 64 56 60 62"
                    stroke="#93A2FA"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    fill="none"
                  />
                  {/* Little bee / fly */}
                  <circle cx="60" cy="22" r="3.5" fill="#3D5AFE" />
                  <ellipse cx="56" cy="20" rx="3" ry="1.8" fill="#93A2FA" />
                  <ellipse cx="64" cy="20" rx="3" ry="1.8" fill="#93A2FA" />
                </svg>
              </div>

              <h2 className="text-base font-extrabold text-foreground sm:text-lg">
                No new bookings requests yet.
              </h2>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                Accept a job to see it here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {newRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className="group cursor-pointer rounded-2xl border border-border/80 bg-white p-5 shadow-2xs transition-all hover:border-primary/50 hover:shadow-md"
                >
                  {/* Category icon + Title + Tags */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${request.iconBg} ${request.iconColor}`}
                    >
                      {request.iconEmoji}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                          {request.serviceTitle}
                        </h3>
                      </div>

                      {/* Tags */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary">
                          Budget: {request.budget}
                        </span>
                        {request.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Row: Status Pending */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                    <span className="text-xs font-medium text-muted">Status</span>
                    <span className="rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-xs font-semibold text-[#2e7d32]">
                      Pending
                    </span>
                  </div>

                  {/* Schedule Row */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                      <Calendar size={18} color="#71717a" variant="Linear" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{request.schedule}</p>
                      <p className="text-[11px] text-muted">Schedule</p>
                    </div>
                  </div>

                  {/* Customer Row + Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-border">
                        <Image
                          src={request.customerAvatar}
                          alt={request.customerName}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{request.customerName}</p>
                        <div className="flex items-center gap-1 text-[11px] text-muted">
                          <Location size={12} color="#3d5afe" variant="Bold" />
                          <span>{request.distance}</span>
                        </div>
                      </div>
                    </div>

                    {/* Accept / Decline Buttons */}
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleAccept(request)}
                        className="rounded-xl bg-primary-light px-3.5 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDecline(request.id, request.customerName)}
                        className="rounded-xl bg-[#ffedd5] px-3.5 py-2 text-xs font-bold text-[#9a3412] transition-all hover:bg-orange-200"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ACTIVE BOOKINGS */}
      {activeTab === "active" && (
        <div className="mt-6">
          {activeBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <Clock size={36} color="#3d5afe" variant="Bold" />
              <h2 className="mt-3 text-base font-extrabold text-foreground">No active bookings</h2>
              <p className="mt-1 text-xs text-muted">
                Accept incoming requests from the &quot;New Requests&quot; tab to start working.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-xs font-semibold text-[#2e7d32]">
                        In progress
                      </span>
                      <h3 className="mt-2 text-base font-extrabold text-foreground">
                        {booking.serviceTitle}
                      </h3>
                      <p className="text-xs text-muted">{booking.address}</p>
                    </div>
                    <span className="text-base font-extrabold text-primary">
                      {booking.budget}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-border">
                        <Image
                          src={booking.customerAvatar}
                          alt={booking.customerName}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {booking.customerName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/chats")}
                      className="flex items-center gap-1.5 rounded-xl bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                    >
                      <Sms size={15} color="#3d5afe" variant="Bold" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: COMPLETED BOOKINGS (Matching Figma Image 3) */}
      {activeTab === "completed" && (
        <div className="mt-6 space-y-3">
          {completedList.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-white p-4 transition-all hover:border-primary/30 hover:shadow-2xs sm:p-5"
            >
              {/* Left side: Avatar + Service details */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-2 ring-emerald-100">
                  <DirectRight size={20} color="#059669" variant="Bold" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground sm:text-base">
                    {item.customerName}
                  </h3>
                  <p className="text-xs text-muted">{item.serviceTitle}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                    <Calendar size={13} color="#71717a" variant="Linear" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Right side: Star rating & Amount */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Star1 size={15} color="#f59e0b" variant="Bold" />
                  <span className="text-xs font-bold text-foreground">{item.rating}</span>
                </div>
                <p className="mt-1 text-base font-extrabold text-primary sm:text-lg">
                  {item.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOOKING REQUEST DETAILS MODAL (Matching Figma Mockup 4) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4 backdrop-blur-2xs animate-in fade-in">
          <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-1.5 rounded-full bg-primary" />
                <h2 className="text-xl font-extrabold text-foreground">Bookings Request</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-foreground"
              >
                <CloseCircle size={22} color="currentColor" />
              </button>
            </div>

            {/* Customer Header Row */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-border">
                  <Image
                    src={selectedRequest.customerAvatar}
                    alt={selectedRequest.customerName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">
                    {selectedRequest.customerName}
                  </h3>
                  <p className="text-xs text-muted">{selectedRequest.serviceTitle}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Star1 size={15} color="#f59e0b" variant="Bold" />
                  <span className="text-xs font-bold text-foreground">
                    {selectedRequest.customerRating}
                  </span>
                </div>
                <p className="mt-0.5 text-base font-extrabold text-primary">
                  {selectedRequest.budget}
                </p>
              </div>
            </div>

            {/* Address & Date Information */}
            <div className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Location size={16} color="#3d5afe" variant="Bold" />
                <span>{selectedRequest.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Calendar size={16} color="#3d5afe" variant="Bold" />
                <span>{selectedRequest.dateFull}</span>
              </div>
            </div>

            {/* Customer's Note Box (Lavender background) */}
            <div className="mt-5 rounded-2xl bg-[#f8f9fe] border border-primary/10 p-4">
              <h4 className="text-xs font-bold text-primary">Customer&apos;s Note</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-700">
                {selectedRequest.customerNote}
              </p>
            </div>

            {/* Images section */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-foreground">Images</h4>
              <div className="mt-2.5 flex items-center gap-3">
                {selectedRequest.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 overflow-hidden rounded-xl ring-1 ring-border"
                  >
                    <Image
                      src={img}
                      alt="Uploaded job photo"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons: Message Customer & Accept Booking */}
            <div className="mt-6 flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRequest(null);
                  router.push("/dashboard/chats");
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-light py-3 text-xs font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
              >
                <Sms size={16} color="#3d5afe" variant="Bold" />
                <span>Message Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleAccept(selectedRequest)}
                className="flex-1 rounded-xl bg-primary py-3 text-center text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95"
              >
                Accept Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
