"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/useAuthStore";
import { timeAgo } from "@/lib/timeAgo";

export default function NotificationsPage() {
  const router = useRouter();
  const initAuth = useAuthStore((s) => s.initAuth);
  const { items, unread, loading, markRead } = useNotifications();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <DashboardShell>
      <div className="px-6 py-6 lg:px-10 lg:py-8 lg:max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Notifications</h1>
          {unread > 0 && (
            <button type="button" onClick={() => markRead()} className="text-xs font-semibold text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-muted">Loading...</p>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-zinc-50/60 p-12 text-center text-sm text-muted">
            Nothing yet. Updates about your bookings, payments and account will show up here.
          </div>
        ) : (
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  if (!n.is_read) markRead(n.id);
                  if (n.link) router.push(n.link);
                }}
                className={`block w-full px-5 py-4 text-left transition-colors hover:bg-zinc-50 ${n.is_read ? "" : "bg-primary-light/40"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <span className="shrink-0 text-[11px] text-zinc-400">{timeAgo(n.created_at)}</span>
                </div>
                {n.body && <p className="mt-0.5 text-xs text-muted">{n.body}</p>}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
