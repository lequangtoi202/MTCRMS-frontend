function readEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  get appName() {
    return process.env.NEXT_PUBLIC_APP_NAME || "MTCRMS";
  },
  get apiBaseUrl() {
    return readEnv("NEXT_PUBLIC_API_BASE_URL");
  },
} as const;
