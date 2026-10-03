"use client";

import { useCallback, useEffect, useState } from "react";
import { coreApi } from "@/lib/api/core";
import type { AppNotification } from "@/types/api";

/** The signed-in user's notifications, refreshed every minute while the page is open. */
export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await coreApi.getNotifications();
        if (cancelled) return;
        setItems(data.items);
        setUnread(data.unread);
      } catch {
        // not signed in yet, or offline: the bell just stays quiet
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [tick]);

  const markRead = useCallback(async (id?: number) => {
    setItems((prev) => prev.map((n) => (id === undefined || n.id === id ? { ...n, is_read: true } : n)));
    setUnread((u) => (id === undefined ? 0 : Math.max(0, u - 1)));
    try {
      await coreApi.markNotificationsRead(id);
    } catch {
      // the next refresh restores the true state
    }
  }, []);

  return { items, unread, loading, markRead };
}
