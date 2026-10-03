"use client";

import { useEffect, useState } from "react";
import type { Provider } from "@/components/ui/ProviderCard";
import { artisansApi } from "@/lib/api/artisans";
import { ApiError } from "@/lib/api/client";
import { detailToProvider } from "@/lib/artisanMapper";

type Status = "loading" | "ready" | "not-found" | "error";

interface State {
  provider: Provider | null;
  status: Status;
  error: string | null;
}

/**
 * Loads one provider from the API. With `withReviews`, also loads the reviews
 * customers have left for them (a failed reviews request never hides the profile).
 * Call `reload()` to fetch again, e.g. after submitting a review.
 */
export function useArtisan(artisanId: string, { withReviews = false } = {}) {
  const [state, setState] = useState<State>({ provider: null, status: "loading", error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [detail, reviews] = await Promise.all([
          artisansApi.get(artisanId),
          withReviews ? artisansApi.reviews(artisanId).catch(() => []) : Promise.resolve([]),
        ]);
        if (cancelled) return;
        setState({ provider: detailToProvider(detail, reviews), status: "ready", error: null });
      } catch (err: unknown) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setState({ provider: null, status: "not-found", error: null });
        } else {
          setState({
            provider: null,
            status: "error",
            error: err instanceof Error ? err.message : "We couldn't load this provider.",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [artisanId, withReviews, reloadKey]);

  const reload = () => {
    setState((current) => ({ ...current, status: "loading" }));
    setReloadKey((k) => k + 1);
  };

  return { ...state, reload };
}
