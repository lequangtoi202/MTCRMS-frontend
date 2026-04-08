import { env } from "@/shared/config/env";
import { getAccessToken } from "@/features/auth/lib/auth-session";
import { refreshAccessToken } from "@/features/auth/lib/auth-session-client";
import { parseApiResponse } from "@/shared/lib/api/parse-api-response";

import { createUrl } from "./create-url";

type RequestOptions = RequestInit & {
  baseUrl?: string;
  skipAuthRefresh?: boolean;
};

export async function httpClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { baseUrl = env.apiBaseUrl, headers, skipAuthRefresh = false, ...restOptions } = options;
  const accessToken = typeof window !== "undefined" ? getAccessToken() : null;

  const executeRequest = (token: string | null) =>
    fetch(createUrl(baseUrl, path), {
      ...restOptions,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

  let response = await executeRequest(accessToken);

  if (response.status === 401 && !skipAuthRefresh && typeof window !== "undefined") {
    const nextAccessToken = await refreshAccessToken();

    if (nextAccessToken) {
      response = await executeRequest(nextAccessToken);
    }
  }

  return parseApiResponse<T>(response);
}
