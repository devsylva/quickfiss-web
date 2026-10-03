import { apiClient } from "./client";
import type { ArtisanKycPayload, ArtisanCustomizationPayload } from "@/types/api";

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
      if (p.service_years) {
        body.append("service_years", p.service_years);
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

    return apiClient("/api/artisan/customization/", {
      method: "PUT",
      body,
      requiresAuth: true,
    });
  },
};
