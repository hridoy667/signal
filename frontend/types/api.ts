/** REST / shared API response shapes (align with Nest where applicable). */

export type ApiSuccess<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
  error?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  accessToken: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type AuthUserPreview = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  avatarUrl?: string | null;
};

/** `POST /auth/verify-email` — `user` is top-level (Nest does not wrap in `data`). */
export type VerifyEmailApiResponse = {
  success: boolean;
  message?: string;
  user: {
    id: string;
    email: string;
  };
};
