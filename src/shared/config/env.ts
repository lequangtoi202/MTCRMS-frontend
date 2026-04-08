const PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
const PUBLIC_API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function requirePublicEnv(value: string | undefined, name: string, fallback?: string) {
  const resolvedValue = value ?? fallback;

  if (!resolvedValue) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return resolvedValue;
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
    return PUBLIC_APP_NAME || "MTCRMS";
  },
  get apiPrefix() {
    return PUBLIC_API_PREFIX || "/api/v1";
  },
  get apiBaseUrl() {
    return normalizeApiBaseUrl(
      requirePublicEnv(PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL"),
      env.apiPrefix,
    );
  },
} as const;
