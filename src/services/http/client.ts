type RequestOptions = RequestInit & {
  baseUrl?: string;
};

export async function httpClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "", headers, ...restOptions } = options;

  const response = await fetch(`${baseUrl}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
