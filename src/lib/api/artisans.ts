import { apiClient } from "./client";
import type { ArtisanDetail, ArtisanReview, ArtisanSummary, MyProviderProfile, ServiceArea } from "@/types/api";

export const artisansApi = {
  /**
   * Browse providers. `recommended` limits results to the signed-in
   * customer's preferred categories.
   */
  list: (params: { q?: string; category?: string; recommended?: boolean; limit?: number; lat?: number; lng?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (params.recommended) query.set("recommended", "1");
    if (params.limit) query.set("limit", String(params.limit));
    if (params.lat !== undefined && params.lng !== undefined) {
      query.set("lat", String(params.lat));
      query.set("lng", String(params.lng));
    }
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

  /** The signed-in provider's own profile: review status, online flag, service area, completeness. */
  me: () => {
    return apiClient<MyProviderProfile>("/api/artisan/profile/", { method: "GET", requiresAuth: true });
  },

  /** Go online / offline. Offline providers can't receive new requests. */
  setOnline: (isOnline: boolean) => {
    return apiClient<{ is_online: boolean }>("/api/artisan/status/", {
      method: "PUT",
      body: { is_online: isOnline },
      requiresAuth: true,
    });
  },

  /** Where the provider works and how far they will travel. */
  setServiceArea: (area: ServiceArea) => {
    return apiClient<ServiceArea>("/api/artisan/location/", {
      method: "PUT",
      body: area,
      requiresAuth: true,
    });
  },
};
