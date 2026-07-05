import { api } from "./axios";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export async function loginApi(payload: LoginRequest) {
  const { data } = await api.post<LoginResponse>(
    "/auth/login",
    payload
  );

  return data.data;
}