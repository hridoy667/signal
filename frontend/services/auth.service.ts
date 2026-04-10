import type {
  ApiSuccess,
  LoginCredentials,
  LoginResponseData,
  RegisterPayload,
  VerifyEmailApiResponse,
  VerifyEmailPayload,
} from "@/types";
import type { MeUser } from "@/types/dashboard";
import { apiFetch, apiFetchAuth } from "@/lib/api";

export async function login(credentials: LoginCredentials) {
  return apiFetch<ApiSuccess<LoginResponseData>>("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function registerMultipart(
  payload: RegisterPayload,
  image?: File | null,
) {
  const form = new FormData();
  form.append("first_name", payload.first_name);
  if (payload.last_name) form.append("last_name", payload.last_name);
  form.append("email", payload.email);
  form.append("password", payload.password);
  form.append("district", payload.district);
  form.append("gender", payload.gender);
  if (image) form.append("image", image);

  return apiFetch<ApiSuccess<unknown>>("/auth/register", {
    method: "POST",
    body: form,
  });
}

export async function verifyEmail(body: VerifyEmailPayload) {
  return apiFetch<VerifyEmailApiResponse>("/auth/verify-email", {
    method: "POST",
    body,
  });
}

export async function resendOtp(email: string) {
  return apiFetch<ApiSuccess<unknown>>("/auth/resend-otp", {
    method: "POST",
    body: { email },
  });
}

export async function getMe() {
  return apiFetchAuth<ApiSuccess<MeUser>>("/auth/me");
}
