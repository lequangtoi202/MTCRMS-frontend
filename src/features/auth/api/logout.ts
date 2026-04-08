import { httpClient } from "@/services/http/client";

import type { LogoutPayload } from "../types/auth";

export function logout(payload: LogoutPayload) {
  return httpClient<null>("/auth/logout", {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
    skipAuthRefresh: true,
  });
}
