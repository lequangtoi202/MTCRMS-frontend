import { env } from "@/shared/config/env";
import { parseApiResponse } from "@/shared/lib/api/parse-api-response";

import { createUrl } from "./create-url";

type RequestOptions = RequestInit & {
  baseUrl?: string;
};

export async function httpClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { baseUrl = env.apiBaseUrl, headers, ...restOptions } = options;

  const response = await fetch(createUrl(baseUrl, path), {
    ...restOptions,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
  });

  return parseApiResponse<T>(response);
}
