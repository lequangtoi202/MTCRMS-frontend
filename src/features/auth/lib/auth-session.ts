"use client";

import type { LoginResponse, SessionState } from "../types/auth";

const SESSION_STORAGE_KEY = "mtcrms.auth.session";
const SESSION_CHANGE_EVENT = "mtcrms:auth-session-change";
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

function isBrowser() {
  return typeof window !== "undefined";
}

function notifySessionChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function createSessionState(payload: LoginResponse): SessionState {
  const now = Date.now();

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    mustChangePassword: payload.user.mustChangePassword,
    expiresAt: null,
    lastActivityAt: now,
    user: payload.user,
  };
}

export function readSession() {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as SessionState;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function getAccessToken() {
  return readSession()?.accessToken ?? null;
}

export function writeSession(session: SessionState) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  notifySessionChange();
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  notifySessionChange();
}

export function touchSession() {
  const session = readSession();

  if (!session) {
    return null;
  }

  const nextSession = {
    ...session,
    lastActivityAt: Date.now(),
  };

  writeSession(nextSession);
  return nextSession;
}

export function subscribeToSession(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (!event.key || event.key === SESSION_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(SESSION_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(SESSION_CHANGE_EVENT, onStoreChange);
  };
}

export function isSessionExpired(session: SessionState) {
  const now = Date.now();

  if (session.expiresAt && now >= session.expiresAt) {
    return true;
  }

  return now - session.lastActivityAt >= SESSION_TIMEOUT_MS;
}

export { SESSION_TIMEOUT_MS };
