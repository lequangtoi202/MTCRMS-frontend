"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { ROUTES } from "@/shared/constants/routes";

import { clearSession, isSessionExpired, readSession, subscribeToSession, touchSession } from "../lib/auth-session";

const ACTIVITY_EVENTS = ["click", "keydown", "mousemove", "scroll", "touchstart"] as const;

export function useSessionGuard() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, readSession, () => null);

  useEffect(() => {
    if (!session || isSessionExpired(session)) {
      clearSession();
      router.replace(`${ROUTES.login}?reason=session-expired`);
      return;
    }

    const syncSession = () => {
      const nextSession = touchSession();

      if (!nextSession || isSessionExpired(nextSession)) {
        clearSession();
        router.replace(`${ROUTES.login}?reason=session-expired`);
      }
    };

    const intervalId = window.setInterval(syncSession, 60 * 1000);

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, syncSession, { passive: true });
    });

    return () => {
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
