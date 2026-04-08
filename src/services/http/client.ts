import { env } from "@/shared/config/env";
import { getAccessToken } from "@/features/auth/lib/auth-session";
import { parseApiResponse } from "@/shared/lib/api/parse-api-response";

import { createUrl } from "./create-url";

type RequestOptions = RequestInit & {
  baseUrl?: string;
};

export async function httpClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { baseUrl = env.apiBaseUrl, headers, ...restOptions } = options;
  const accessToken = typeof window !== "undefined" ? getAccessToken() : null;

  const response = await fetch(createUrl(baseUrl, path), {
    ...restOptions,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  return parseApiResponse<T>(response);
}
