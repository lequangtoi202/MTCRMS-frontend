import { env } from "@/shared/config/env";
import { parseApiResponse } from "@/shared/lib/api/parse-api-response";
import { createUrl } from "@/services/http/create-url";

import type { RefreshTokenPayload, RefreshTokenResponse } from "../types/auth";

export async function refreshToken(payload: RefreshTokenPayload) {
  const response = await fetch(createUrl(env.apiBaseUrl, "/auth/refresh"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  return parseApiResponse<RefreshTokenResponse>(response);
}
