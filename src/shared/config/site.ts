import { env } from "@/shared/config/env";

export const siteConfig = {
  name: env.appName,
  description: "A professional frontend baseline for CRM modules, team workflows, and reusable business UI.",
} as const;
