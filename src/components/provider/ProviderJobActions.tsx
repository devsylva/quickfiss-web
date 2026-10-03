"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sms } from "iconsax-react";
import { bookingsApi } from "@/lib/api/bookings";
import { chatApi } from "@/lib/api/chat";
import { formatNaira } from "@/lib/money";
import type { Booking } from "@/types/api";

interface Props {
  booking: Booking;
  onChange: (booking: Booking) => void;
  /** Smaller buttons for the dashboard cards. */
  compact?: boolean;
}

/** What a provider can do with one booking right now, depending on where it is in its life. */
export function ProviderJobActions({ booking, onChange, compact }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<"quote" | "decline" | null>(null);
  const [price, setPrice] = useState(booking.budget ? String(Math.round(Number(booking.budget))) : "");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<Booking>) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await action());
      setModal(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const message = async () => {
    try {
      const room = await chatApi.createRoomForBooking(booking.id);
      router.push(`/dashboard/chats?room=${room.id}`);
    } catch {
      router.push("/dashboard/chats");
    }
  };

  const btn = compact ? "px-3.5 py-2 text-xs" : "px-4 py-2.5 text-xs sm:text-sm";
  const primary = `rounded-xl bg-primary-light font-bold text-primary transition-all hover:bg-primary hover:text-white active:scale-95 disabled:opacity-50 ${btn}`;
  const warn = `rounded-xl bg-[#ffedd5] font-bold text-[#9a3412] transition-all hover:bg-orange-200 active:scale-95 disabled:opacity-50 ${btn}`;
  const quiet = `flex items-center gap-1.5 rounded-xl bg-zinc-100 font-semibold text-foreground hover:bg-zinc-200 ${btn}`;

  const { booking_status: status, payment_status: payment } = booking;
  let buttons: React.ReactNode = null;
  let note: string | null = null;

  if (status === "pending") {
    buttons = (
      <>
        <button type="button" className={primary} onClick={() => setModal("quote")}>
          Accept
        </button>
        <button type="button" className={warn} onClick={() => setModal("decline")}>
          Decline
        </button>
      </>
    );
  } else if (status === "active" && payment === "unpaid") {
    note = `Quoted ${formatNaira(booking.price)}. Waiting for the customer to pay.`;
    buttons = (
      <button type="button" className={warn} onClick={() => setModal("decline")}>
        Cancel job
      </button>
    );
  } else if (status === "active" && payment === "held") {
    note = `${formatNaira(booking.price)} is safely held for you. Mark the job as done when you finish.`;
    buttons = (
      <button type="button" disabled={busy} className={primary} onClick={() => run(() => bookingsApi.completeBooking(booking.id))}>
        {busy ? "Saving..." : "Mark as done"}
      </button>
    );
  } else if (status === "active") {
    // Accepted before payments existed: no money is held.
    buttons = (
      <button type="button" disabled={busy} className={primary} onClick={() => run(() => bookingsApi.completeBooking(booking.id))}>
        Mark as done
      </button>
    );
  } else if (status === "completed" && payment === "held") {
    note = "Waiting for the customer to confirm. You'll be paid automatically if they don't respond.";
  } else if (status === "completed" && payment === "disputed") {
    note = "The customer reported a problem. Support is reviewing it and will release or refund the payment.";
  } else if (status === "completed" && payment === "released") {
    note = `Paid: ${formatNaira(booking.provider_payout)} added to your wallet.`;
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {note && <p className="mb-2 text-[11px] leading-relaxed text-muted sm:text-xs">{note}</p>}
      <div className="flex flex-wrap items-center justify-end gap-2">
        {status !== "cancelled" && (
          <button type="button" className={quiet} onClick={message}>
            <Sms size={15} color="#3d5afe" variant="Bold" />
            <span>Message</span>
          </button>
        )}
        {buttons}
      </div>
      {!modal && error && <p className="mt-2 text-right text-xs text-red-600">{error}</p>}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
            {modal === "quote" ? (
              <>
                <h2 className="text-lg font-extrabold text-foreground">Quote your price</h2>
                <p className="mt-1 text-xs text-muted">
                  {booking.budget ? `The customer's budget is ${formatNaira(booking.budget)}. ` : ""}
                  They&apos;ll pay this into escrow. You&apos;re paid when the job is confirmed, minus Quickfiss&apos;s
                  service fee.
                </p>
                <label className="mt-4 block text-xs font-semibold text-foreground" htmlFor="quote-price">
                  Price (₦)
                </label>
                <input
                  id="quote-price"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="e.g. 15000"
                  className="mt-1 w-full rounded-input border border-border px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                <div className="mt-5 flex gap-3">
                  <button type="button" className="flex-1 rounded-xl bg-zinc-100 py-3 text-sm font-semibold" onClick={() => { setModal(null); setError(null); }}>
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={busy || !price}
                    className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white disabled:opacity-50"
                    onClick={() => run(() => bookingsApi.acceptBooking(booking.id, Number(price)))}
                  >
                    {busy ? "Sending..." : "Accept & send quote"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-extrabold text-foreground">
                  {status === "pending" ? "Decline this request?" : "Cancel this job?"}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {payment === "held" || payment === "unpaid" ? "Any payment the customer made is refunded in full. " : ""}
                  A short reason helps the customer.
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder="Optional"
                  className="mt-3 w-full rounded-input border border-border px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                <div className="mt-5 flex gap-3">
                  <button type="button" className="flex-1 rounded-xl bg-zinc-100 py-3 text-sm font-semibold" onClick={() => { setModal(null); setError(null); }}>
                    Keep it
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white disabled:opacity-50"
                    onClick={() => run(() => bookingsApi.rejectBooking(booking.id, reason.trim() || undefined))}
                  >
                    {busy ? "Working..." : status === "pending" ? "Decline" : "Cancel job"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
