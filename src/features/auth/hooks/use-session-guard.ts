"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { ROUTES } from "@/shared/constants/routes";

import { refreshAccessToken } from "../lib/auth-session-client";
import {
  clearSession,
  isSessionExpired,
  readSession,
  shouldRefreshAccessToken,
  subscribeToSession,
  touchSession,
} from "../lib/auth-session";

const ACTIVITY_EVENTS = ["click", "keydown", "mousemove", "scroll", "touchstart"] as const;

export function useSessionGuard() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, readSession, () => null);

  useEffect(() => {
    let cancelled = false;

    async function handleSessionHealthCheck() {
      const currentSession = readSession();

      if (!currentSession || isSessionExpired(currentSession)) {
        clearSession();
        router.replace(`${ROUTES.login}?reason=session-expired`);
        return;
      }

      if (shouldRefreshAccessToken(currentSession)) {
        const refreshedToken = await refreshAccessToken();

        if (!refreshedToken && !cancelled) {
          router.replace(`${ROUTES.login}?reason=session-expired`);
        }
      }
    }

    if (!session) {
      clearSession();
      router.replace(ROUTES.login);
      return;
    }

    void handleSessionHealthCheck();

    const syncSession = () => {
      const nextSession = touchSession();

      if (!nextSession || isSessionExpired(nextSession)) {
        clearSession();
        router.replace(`${ROUTES.login}?reason=session-expired`);
        return;
      }

      if (shouldRefreshAccessToken(nextSession)) {
        void handleSessionHealthCheck();
      }
    };

    const intervalId = window.setInterval(() => {
      void handleSessionHealthCheck();
    }, 60 * 1000);

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, syncSession, { passive: true });
    });

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, syncSession);
      });
    };
  }, [router, session]);

  return {
    isChecking: session === null,
    session,
  };
}
