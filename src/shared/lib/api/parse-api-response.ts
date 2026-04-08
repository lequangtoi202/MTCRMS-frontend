import type { ApiErrorPayload, ApiResponseEnvelope } from "@/shared/types/api";

import { ApiError } from "./api-error";

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJsonResponse = contentType.includes("application/json");

  const payload = isJsonResponse ? ((await response.json()) as ApiErrorPayload | T) : null;

  if (!response.ok) {
    const message =
      isJsonResponse && payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : `HTTP ${response.status}: ${response.statusText}`;

    throw new ApiError(message, response.status, (payload as ApiErrorPayload | null) ?? null);
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiResponseEnvelope<T>).data;
  }

  return payload as T;
}
