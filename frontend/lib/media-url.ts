import { getApiBaseUrl } from "@/lib/api";

/** API origin without `/api` — for static files served by the backend. */
export function getPublicOrigin(): string {
  const base = getApiBaseUrl().replace(/\/api$/, "");
  return base || "http://localhost:8000";
}

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${getPublicOrigin()}${url.startsWith("/") ? "" : "/"}${url}`;
}
