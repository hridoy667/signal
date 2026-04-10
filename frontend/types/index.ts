export type {
  ApiSuccess,
  ApiErrorBody,
  LoginCredentials,
  LoginResponseData,
  VerifyEmailPayload,
  VerifyEmailApiResponse,
  AuthUserPreview,
} from "./api";

export type RegisterPayload = {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  district: string;
  gender: "male" | "female";
};
