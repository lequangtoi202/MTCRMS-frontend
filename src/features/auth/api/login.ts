import { httpClient } from "@/services/http/client";

import type { LoginPayload, LoginResponse } from "../types/auth";

export function login(payload: LoginPayload) {
  return httpClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
  });
}
