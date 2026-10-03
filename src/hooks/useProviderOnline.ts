"use client";

import { useCallback, useState } from "react";
import { artisansApi } from "@/lib/api/artisans";
import { useAuthStore } from "@/store/useAuthStore";

/** The provider's online switch, saved on the server so customers see (and can't book) an offline provider. */
export function useProviderOnline() {
  const isOnline = useAuthStore((s) => s.isOnline);
  const setIsOnline = useAuthStore((s) => s.setIsOnline);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setOnline = useCallback(
    async (next: boolean) => {
      if (busy) return;
      setBusy(true);
      setError(null);
      const previous = isOnline;
      setIsOnline(next);
      try {
        await artisansApi.setOnline(next);
      } catch (err: unknown) {
        setIsOnline(previous);
        setError(err instanceof Error ? err.message : "We couldn't change your status.");
      } finally {
        setBusy(false);
      }
    },
    [busy, isOnline, setIsOnline],
  );

  return { isOnline, setOnline, busy, error };
}
