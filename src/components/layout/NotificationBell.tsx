"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Notification } from "iconsax-react";
import { useNotifications } from "@/hooks/useNotifications";
import { timeAgo } from "@/lib/timeAgo";

export function NotificationBell() {
  const router = useRouter();
  const { items, unread, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-foreground"
      >
        <Notification size={19} color="#171717" variant="Linear" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-bold text-foreground">Notifications</span>
            {unread > 0 && (
              <button type="button" onClick={() => markRead()} className="text-xs font-semibold text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="p-6 text-center text-xs text-muted">You&apos;re all caught up.</p>
            ) : (
              items.slice(0, 8).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    if (!n.is_read) markRead(n.id);
                    setOpen(false);
                    if (n.link) router.push(n.link);
                  }}
                  className={`block w-full border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-zinc-50 ${n.is_read ? "" : "bg-primary-light/40"}`}
                >
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-muted">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-zinc-400">{timeAgo(n.created_at)}</p>
                </button>
              ))
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/notifications");
            }}
            className="w-full py-2.5 text-center text-xs font-semibold text-primary hover:bg-zinc-50"
          >
            See all
          </button>
        </div>
      )}
    </div>
  );
}
