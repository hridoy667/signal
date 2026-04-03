import type { ApiErrorBody } from "@/types";

/**
 * Resolves base URL for the Nest API (`/api` global prefix).
 * Set `NEXT_PUBLIC_API_URL` to origin only (e.g. http://localhost:8000) or include `/api`.
 */
export function getApiBaseUrl(): string {
  const raw =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_URL;
  const fallback = "http://localhost:8000";
  const base = (raw ?? fallback).replace(/\/$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: ApiErrorBody,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, headers: initHeaders, ...rest } = options;
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(initHeaders);
  let resolvedBody: BodyInit | undefined;

  if (body instanceof FormData || body instanceof URLSearchParams) {
    resolvedBody = body;
  } else if (body && typeof body === "object") {
    headers.set("Content-Type", "application/json");
    resolvedBody = JSON.stringify(body);
  } else if (body != null) {
    resolvedBody = body as BodyInit;
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    body: resolvedBody,
    credentials: "include",
  });

  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      json = { message: text };
    }
  }

  if (!res.ok) {
    const errBody = json as ApiErrorBody | undefined;
    const msg =
      typeof errBody?.message === "string"
        ? errBody.message
        : Array.isArray(errBody?.message)
          ? errBody.message.join(", ")
          : `Request failed (${res.status})`;
    throw new ApiRequestError(msg, res.status, errBody);
  }

  return json as T;
}
