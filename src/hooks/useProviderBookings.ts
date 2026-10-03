"use client";

import { useCallback, useEffect, useState } from "react";
import { bookingsApi } from "@/lib/api/bookings";
import type { Booking, ProviderStats } from "@/types/api";

/** The signed-in provider's jobs and dashboard numbers, with a way to refresh after an action. */
export function useProviderBookings(withStats = false) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [list, numbers] = await Promise.all([
          bookingsApi.getMyBookings(),
          withStats ? bookingsApi.providerStats() : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setBookings((Array.isArray(list) ? list : []).filter((b) => b.role === "artisan"));
        setStats(numbers);
        setError(null);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "We couldn't load your jobs.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [withStats, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  /** Swap in the server's latest copy of one booking and refresh the totals. */
  const update = useCallback(
    (booking: Booking) => {
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, ...booking } : b)));
      if (withStats) reload();
    },
    [withStats, reload],
  );

  return { bookings, stats, loading, error, reload, update };
}
