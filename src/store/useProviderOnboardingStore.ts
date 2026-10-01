import { create } from "zustand";

export interface ProviderOnboardingState {
  // KYC State (Steps 1-3)
  firstName: string;
  lastName: string;
  profilePicture: File | null;
  day: string;
  month: string;
  year: string;
  gender: string;
  address: string;
  landmark: string;
  proofOfAddress: File | null;
  idType: string;
  idFront: File | null;
  idBack: File | null;

  // Customization State (Steps 4-7)
  services: string[];
  businessName: string;
  bio: string;
  serviceYears: string | null;
  certification: File | null;
  businessAbout: string;
  language: string;
  location: string;
  availability: string[];
  priceRange: [number, number];

  // Actions
  setKycStep1: (data: {
    firstName: string;
    lastName: string;
    profilePicture?: File | null;
    day: string;
    month: string;
    year: string;
    gender: string;
  }) => void;
  setKycStep2: (data: {
    address: string;
    landmark?: string;
    proofOfAddress?: File | null;
  }) => void;
  setKycStep3: (data: {
    idType: string;
    idFront?: File | null;
    idBack?: File | null;
  }) => void;
  setCustomizationStep4: (services: string[]) => void;
  setCustomizationStep5: (data: {
    businessName: string;
    bio: string;
    serviceYears: string | null;
    certification?: File | null;
  }) => void;
  setCustomizationStep6: (data: {
    businessAbout: string;
    language: string;
  }) => void;
  setCustomizationStep7: (data: {
    location: string;
    availability: string[];
    priceRange: [number, number];
  }) => void;
  resetOnboarding: () => void;
}

export const useProviderOnboardingStore = create<ProviderOnboardingState>((set) => ({
  firstName: "",
  lastName: "",
  profilePicture: null,
  day: "",
  month: "",
  year: "",
  gender: "",
  address: "",
  landmark: "",
  proofOfAddress: null,
  idType: "",
  idFront: null,
  idBack: null,

  services: [],
  businessName: "",
  bio: "",
  serviceYears: null,
  certification: null,
  businessAbout: "",
  language: "",
  location: "",
  availability: [],
  priceRange: [10000, 40000],

  setKycStep1: (data) => set((state) => ({ ...state, ...data })),
  setKycStep2: (data) => set((state) => ({ ...state, ...data })),
  setKycStep3: (data) => set((state) => ({ ...state, ...data })),
  setCustomizationStep4: (services) => set({ services }),
  setCustomizationStep5: (data) => set((state) => ({ ...state, ...data })),
  setCustomizationStep6: (data) => set((state) => ({ ...state, ...data })),
  setCustomizationStep7: (data) => set((state) => ({ ...state, ...data })),
  resetOnboarding: () =>
    set({
      firstName: "",
      lastName: "",
      profilePicture: null,
      day: "",
      month: "",
      year: "",
      gender: "",
      address: "",
      landmark: "",
      proofOfAddress: null,
      idType: "",
      idFront: null,
      idBack: null,
      services: [],
      businessName: "",
      bio: "",
      serviceYears: null,
      certification: null,
      businessAbout: "",
      language: "",
      location: "",
      availability: [],
      priceRange: [10000, 40000],
    }),
}));
