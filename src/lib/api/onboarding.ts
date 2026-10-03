import { apiClient } from "./client";
import type {
  ArtisanKycPayload,
  ArtisanCustomizationPayload,
  ClientProfilePayload,
} from "@/types/api";

export const onboardingApi = {
  /**
   * Client onboarding view
   */
  getClientOnboarding: () => {
    return apiClient("/api/client/profile/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Create or update the signed-in customer's profile. Every field is optional,
   * so each onboarding step can save just its own part.
   */
  saveClientProfile: (payload: ClientProfilePayload) => {
    const { profile_picture, preferred_categories, ...fields } = payload;

    let body: FormData | Record<string, unknown>;
    if (profile_picture) {
      const form = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined) form.append(key, String(value));
      });
      preferred_categories?.forEach((name) => form.append("preferred_categories", name));
      form.append("profile_picture", profile_picture);
      body = form;
    } else {
      body = { ...fields, ...(preferred_categories ? { preferred_categories } : {}) };
    }

    return apiClient("/api/client/onboarding/", {
      method: "POST",
      body,
      requiresAuth: true,
    });
  },

  /**
   * Submit artisan KYC details (multipart/form-data)
   */
  submitArtisanKyc: (payload: FormData | ArtisanKycPayload) => {
    let body: FormData;

    if (typeof FormData !== "undefined" && payload instanceof FormData) {
      body = payload;
    } else {
      const p = payload as ArtisanKycPayload;
      body = new FormData();
      body.append("first_name", p.first_name);
      body.append("last_name", p.last_name);
      body.append("date_of_birth", p.date_of_birth);
      body.append("gender", p.gender);
      body.append("address", p.address);

      if (p.landmark) {
        body.append("landmark", p.landmark);
      }
      if (p.profile_picture) {
        body.append("profile_picture", p.profile_picture);
      }
      if (p.proof_of_address) {
        body.append("proof_of_address", p.proof_of_address);
      }
      if (p.id_type) {
        body.append("id_type", p.id_type);
      }
      if (p.id_front) {
        body.append("id_front", p.id_front);
      }
      if (p.id_back) {
        body.append("id_back", p.id_back);
      }
    }

    return apiClient("/api/artisan/kyc/", {
      method: "PUT",
      body,
      requiresAuth: true,
    });
  },

  /**
   * Set artisan profile customization (multipart/form-data)
   */
  submitArtisanCustomization: (payload: FormData | ArtisanCustomizationPayload) => {
    let body: FormData;

    if (typeof FormData !== "undefined" && payload instanceof FormData) {
      body = payload;
    } else {
      const p = payload as ArtisanCustomizationPayload;
      body = new FormData();

      if (p.services && p.services.length > 0) {
        p.services.forEach((s) => body.append("services", String(s)));
      }
      if (p.business_name) {
        body.append("business_name", p.business_name);
      }
      if (p.business_about) {
        body.append("business_about", p.business_about);
      }
      if (p.bio) {
        body.append("bio", p.bio);
      }
      if (p.experience) {
        body.append("experience", p.experience);
      }
      if (p.language) {
        body.append("language", p.language);
      }
      if (p.location) {
        body.append("location", p.location);
      }
      if (p.availability && p.availability.length > 0) {
        p.availability.forEach((day) => body.append("availability", day));
      }
      if (typeof p.min_price === "number") {
        body.append("min_price", String(p.min_price));
      }
      if (typeof p.max_price === "number") {
        body.append("max_price", String(p.max_price));
      }
      if (p.certification) {
        body.append("certification", p.certification);
      }
    }

    return apiClient<{ kyc_status?: "draft" | "pending" | "approved" | "rejected" }>("/api/artisan/customization/", {
      method: "PUT",
      body,
      requiresAuth: true,
    });
  },
};
