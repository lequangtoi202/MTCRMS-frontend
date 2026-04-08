function readEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function normalizeApiBaseUrl(rawBaseUrl: string, apiPrefix: string) {
  const normalizedPrefix = `/${trimSlashes(apiPrefix)}`;
  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

  if (normalizedBaseUrl.endsWith(normalizedPrefix)) {
    return normalizedBaseUrl;
  }

  return `${normalizedBaseUrl}${normalizedPrefix}`;
}

export const env = {
  get appName() {
    return process.env.NEXT_PUBLIC_APP_NAME || "MTCRMS";
  },
  get apiPrefix() {
    return process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";
  },
  get apiBaseUrl() {
    return normalizeApiBaseUrl(readEnv("NEXT_PUBLIC_API_BASE_URL"), env.apiPrefix);
  },
} as const;
