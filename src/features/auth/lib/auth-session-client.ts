"use client";

import { refreshToken } from "../api/refresh-token";
import { clearSession, readSession, updateSessionTokens, writeSession } from "./auth-session";

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const session = readSession();

    if (!session?.refreshToken) {
      clearSession();
      return null;
    }

    try {
      const nextTokens = await refreshToken({ refreshToken: session.refreshToken });
      const nextSession = updateSessionTokens(session, nextTokens);
      writeSession(nextSession);
      return nextSession.accessToken;
    } catch {
      clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
