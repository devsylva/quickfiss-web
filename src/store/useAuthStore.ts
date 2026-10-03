"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import type { User, AuthTokens } from "@/types/api";
import { useProviderOnboardingStore } from "@/store/useProviderOnboardingStore";

const ACCESS_TOKEN_KEY = "quickfiss_access_token";
const REFRESH_TOKEN_KEY = "quickfiss_refresh_token";
const USER_KEY = "quickfiss_user";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: "customer" | "provider";
  isOnline: boolean;

  setAuth: (tokens: AuthTokens) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setActiveRole: (role: "customer" | "provider") => void;
  setIsOnline: (online: boolean) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  activeRole: "provider",
  isOnline: true,

  setAuth: (tokens: AuthTokens) => {
    Cookies.set(ACCESS_TOKEN_KEY, tokens.access, { expires: 7, secure: process.env.NODE_ENV === "production" });
    if (tokens.refresh) {
      Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh, { expires: 30, secure: process.env.NODE_ENV === "production" });
    }
    if (tokens.user) {
      Cookies.set(USER_KEY, JSON.stringify(tokens.user), { expires: 30 });
    }

    set({
      accessToken: tokens.access,
      refreshToken: tokens.refresh || get().refreshToken,
      user: tokens.user || get().user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setAccessToken: (token: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 7, secure: process.env.NODE_ENV === "production" });
    set({ accessToken: token, isAuthenticated: true });
  },

  setUser: (user: User) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 30 });
    set({ user });
  },

  setActiveRole: (role: "customer" | "provider") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quickfiss_active_role", role);
    }
    set({ activeRole: role });
  },

  setIsOnline: (online: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quickfiss_provider_online", online ? "1" : "0");
    }
    set({ isOnline: online });
  },

  clearAuth: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);

    // Saved onboarding answers (names, DOB, address, ID images) must not outlive the session.
    useProviderOnboardingStore.getState().resetOnboarding();

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initAuth: () => {
    const access = Cookies.get(ACCESS_TOKEN_KEY) || null;
    const refresh = Cookies.get(REFRESH_TOKEN_KEY) || null;
    const userCookie = Cookies.get(USER_KEY);
    let parsedUser: User | null = null;

    if (userCookie) {
      try {
        parsedUser = JSON.parse(userCookie);
      } catch {
        parsedUser = null;
      }
    }

    let savedRole: "customer" | "provider" = "provider";
    let savedOnline = true;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quickfiss_active_role");
      if (stored === "customer" || stored === "provider") {
        savedRole = stored;
      } else if (parsedUser?.user_type === "client") {
        savedRole = "customer";
      } else {
        savedRole = "provider";
      }

      const storedOnline = localStorage.getItem("quickfiss_provider_online");
      if (storedOnline !== null) {
        savedOnline = storedOnline === "1";
      }
    }

    set({
      accessToken: access,
      refreshToken: refresh,
      user: parsedUser,
      isAuthenticated: Boolean(access),
      activeRole: savedRole,
      isOnline: savedOnline,
      isLoading: false,
    });
  },
}));

// Synchronous cookie getter helpers for api client
export const getStoredAccessToken = (): string | null => {
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
};

export const getStoredRefreshToken = (): string | null => {
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
};
