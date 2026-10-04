import { prepareFormData } from "@/lib/prepareUpload";
import { getStoredAccessToken, getStoredRefreshToken, useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.quickfiss.com"
).replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  requiresAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

/**
 * Perform a typed API request to Quickfiss backend.
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers: customHeaders, body, ...restOptions } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData && body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Attach access token if auth is required
  if (requiresAuth) {
    const token = getStoredAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let requestBody: BodyInit | null | undefined = undefined;
  if (isFormData) {
    requestBody = await prepareFormData(body as FormData);
  } else if (body && typeof body === "object") {
    requestBody = JSON.stringify(body);
  } else if (typeof body === "string") {
    requestBody = body;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers,
      body: requestBody,
    });
  } catch {
    // The request never got an answer: offline, a dropped mobile connection, or a blocked upload.
    throw new ApiError("We couldn't reach Quickfiss. Check your internet connection and try again.", 0);
  }

  // Handle 401 Unauthorized with token refresh
  if (response.status === 401 && requiresAuth) {
    const refreshToken = getStoredRefreshToken();

    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshRes = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newAccessToken =
              refreshData?.data?.access || refreshData?.access;

            const newRefreshToken =
              refreshData?.data?.refresh || refreshData?.refresh;

            if (newAccessToken) {
              if (newRefreshToken) {
                useAuthStore
                  .getState()
                  .setAuth({ access: newAccessToken, refresh: newRefreshToken });
              } else {
                useAuthStore.getState().setAccessToken(newAccessToken);
              }
              isRefreshing = false;
              onTokenRefreshed(newAccessToken);

              // Retry original request with new token
              headers["Authorization"] = `Bearer ${newAccessToken}`;
              const retryResponse = await fetch(url, {
                ...restOptions,
                headers,
                body: requestBody,
              });
              return handleResponse<T>(retryResponse);
            }
          }
        } catch {
          // Token refresh failed completely
        }

        isRefreshing = false;
        useAuthStore.getState().clearAuth();
      } else {
        // Wait for token refresh to complete then retry
        return new Promise<T>((resolve, reject) => {
          addRefreshSubscriber(async (newToken: string) => {
            try {
              headers["Authorization"] = `Bearer ${newToken}`;
              const retryRes = await fetch(url, {
                ...restOptions,
                headers,
                body: requestBody,
              });
              resolve(handleResponse<T>(retryRes));
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    } else {
      useAuthStore.getState().clearAuth();
    }
  }

  return handleResponse<T>(response);
}

/** Flattens { field: ["reason", ...] } style validation errors into plain sentences. */
function collectReasons(errors: unknown): string[] {
  if (!errors || typeof errors !== "object") return [];
  return Object.values(errors as Record<string, unknown>)
    .flat(Infinity as 1)
    .filter((reason): reason is string => typeof reason === "string");
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let payload: unknown = null;
  if (isJson) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    let errorMessage = "An error occurred";
    if (payload) {
      if (typeof payload === "string") {
        const looksLikeHtml = /^\s*<(!doctype|html)/i.test(payload);
        errorMessage =
          looksLikeHtml || payload.length > 300
            ? response.status === 404
              ? "Service endpoint not found. Please try again later."
              : "Something went wrong on our end. Please try again."
            : payload;
      } else if (typeof payload === "object" && payload !== null) {
        const obj = payload as Record<string, unknown>;
        if (typeof obj.message === "string") {
          // Backend errors often carry the useful reason in `errors` ({ field: ["reason"] }).
          const reasons = collectReasons(obj.errors);
          errorMessage = reasons.length > 0 ? `${obj.message} ${reasons.join(" ")}` : obj.message;
        } else if (typeof obj.detail === "string") {
          errorMessage = obj.detail;
        } else if (typeof obj.error === "string") {
          errorMessage = obj.error;
        } else {
          // Aggregate validation errors if dictionary
          const values = Object.values(obj);
          if (values.length > 0 && typeof values[0] === "string") {
            errorMessage = values.join(", ");
          } else if (values.length > 0 && Array.isArray(values[0])) {
            errorMessage = (values as unknown[][]).flat().join(", ");
          }
        }
      }
    }
    throw new ApiError(errorMessage, response.status, payload);
  }

  // If response is envelope { success, message, data }, return data directly
  if (
    payload &&
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    "success" in payload
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}
