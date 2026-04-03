import { getAccessToken } from "@/lib/auth-storage";
import { apiFetch, ApiRequestError } from "./client";

type FetchArgs = Parameters<typeof apiFetch>[1];

/** Authenticated API calls (Bearer token from localStorage). Client-only. */
export function apiFetchAuth<T>(path: string, options: FetchArgs = {}): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    return Promise.reject(new ApiRequestError("Not authenticated", 401));
  }
  const headers = new Headers(options.headers);
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return apiFetch<T>(path, { ...options, headers });
}
