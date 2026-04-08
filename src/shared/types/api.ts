export type ApiErrorPayload = {
  message?: string;
  [key: string]: unknown;
};

export type ApiResponseEnvelope<T> = {
  message: string;
  data: T;
};
