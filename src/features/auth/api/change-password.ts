import { httpClient } from "@/services/http/client";

import type { ChangePasswordPayload } from "../types/auth";

export function changePassword(payload: ChangePasswordPayload) {
  return httpClient<null>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
  });
}
