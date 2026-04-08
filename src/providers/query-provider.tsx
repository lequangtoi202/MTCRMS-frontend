"use client";

import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { queryClientConfig } from "@/shared/config/query";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient(queryClientConfig);
  }

  browserQueryClient ??= new QueryClient(queryClientConfig);

  return browserQueryClient;
}

export function QueryProvider({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
