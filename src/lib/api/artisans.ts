import { apiClient } from "./client";
import type { ArtisanDetail, ArtisanReview, ArtisanSummary } from "@/types/api";

export const artisansApi = {
  /**
   * Browse providers. `recommended` limits results to the signed-in
   * customer's preferred categories.
   */
  list: (params: { q?: string; category?: string; recommended?: boolean; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (params.recommended) query.set("recommended", "1");
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiClient<ArtisanSummary[]>(`/api/artisans/${qs ? `?${qs}` : ""}`, {
      method: "GET",
      // Only "recommended" depends on who is asking; plain browsing works signed out.
      requiresAuth: params.recommended === true,
    });
  },

  /** Full public profile of one provider. */
  get: (artisanId: string | number) => {
    return apiClient<ArtisanDetail>(`/api/artisans/${encodeURIComponent(String(artisanId))}/`, {
      method: "GET",
      requiresAuth: false,
    });
  },

  /** Reviews customers have left for a provider. */
  reviews: (artisanId: string | number) => {
    return apiClient<ArtisanReview[]>(`/api/artisans/${encodeURIComponent(String(artisanId))}/reviews/`, {
      method: "GET",
      requiresAuth: false,
    });
  },
};
