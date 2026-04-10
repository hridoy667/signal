import { apiFetch } from "@/lib/api";

export type DistrictOption = { id: number; name: string };

export function fetchDistricts() {
  return apiFetch<DistrictOption[]>("/districts");
}
