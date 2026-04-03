import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
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

/** Kept similar to `fetch` options so existing service modules stay unchanged. */
type FetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
};

function headersToRecord(h: HeadersInit | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!h) return out;
  if (h instanceof Headers) {
    h.forEach((v, k) => {
      out[k] = v;
    });
    return out;
  }
  if (Array.isArray(h)) {
    for (const [k, v] of h) out[k] = v;
    return out;
  }
  Object.assign(out, h as Record<string, string>);
  return out;
}

function parseErrorBody(data: unknown): ApiErrorBody | undefined {
  if (data && typeof data === "object") return data as ApiErrorBody;
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as ApiErrorBody;
    } catch {
      return { message: data };
    }
  }
  return undefined;
}

/**
 * HTTP client for the REST API. Uses Axios (shared instance config) with the same
 * surface as the previous `fetch` wrapper: JSON bodies, FormData, credentials.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, headers: initHeaders, ...rest } = options;
  const url = path.startsWith("/") ? path : `/${path}`;

  const headers = headersToRecord(initHeaders);

  let data: unknown;
  if (body instanceof FormData || body instanceof URLSearchParams) {
    data = body;
    delete headers["Content-Type"];
    delete headers["content-type"];
  } else if (body && typeof body === "object" && !(body instanceof Blob)) {
    data = body;
    if (!headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }
  } else if (body != null) {
    data = body;
  }

  const method = (typeof rest.method === "string" ? rest.method : "GET").toUpperCase();
  const signal = rest.signal ?? undefined;

  const config: AxiosRequestConfig = {
    baseURL: getApiBaseUrl(),
    url,
    method,
    headers,
    withCredentials: true,
    ...(signal ? { signal } : {}),
  };

  if (method === "GET" || method === "HEAD") {
    config.data = undefined;
  } else {
    config.data = data;
  }

  try {
    const res = await axios.request<T>(config);
    return res.data as T;
  } catch (e) {
    if (isAxiosError(e)) {
      const status = e.response?.status ?? 0;
      const errBody = parseErrorBody(e.response?.data);
      const msg =
        typeof errBody?.message === "string"
          ? errBody.message
          : Array.isArray(errBody?.message)
            ? errBody.message.join(", ")
            : e.message || (status ? `Request failed (${status})` : "Network error");
      throw new ApiRequestError(msg, status, errBody);
    }
    throw e;
  }
}
