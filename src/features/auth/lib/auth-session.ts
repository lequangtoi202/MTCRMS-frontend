"use client";

import type { LoginResponse, RefreshTokenResponse, SessionState } from "../types/auth";

const SESSION_STORAGE_KEY = "mtcrms.auth.session";
const SESSION_CHANGE_EVENT = "mtcrms:auth-session-change";
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

let cachedSessionRaw: string | null = null;
let cachedSessionValue: SessionState | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function notifySessionChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

function decodeJwtPayload(token: string) {
  const payloadSegment = token.split(".")[1];

  if (!payloadSegment || !isBrowser()) {
    return null;
  }

  try {
    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = window.atob(padded);

    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

function getAccessTokenExpiry(accessToken: string) {
  const payload = decodeJwtPayload(accessToken);

  return payload?.exp ? payload.exp * 1000 : null;
}

function createSessionFromTokens(
  currentUser: SessionState["user"],
  mustChangePassword: boolean,
  accessToken: string,
  refreshToken: string,
  refreshTokenExpiresAt: string,
): SessionState {
  return {
    accessToken,
    refreshToken,
    mustChangePassword,
    expiresAt: getAccessTokenExpiry(accessToken),
    refreshTokenExpiresAt: new Date(refreshTokenExpiresAt).getTime(),
    lastActivityAt: Date.now(),
    user: currentUser,
  };
}

export function createSessionState(payload: LoginResponse): SessionState {
  return createSessionFromTokens(
    payload.user,
    payload.user.mustChangePassword,
    payload.accessToken,
    payload.refreshToken,
    payload.refreshTokenExpiresAt,
  );
}

export function updateSessionTokens(currentSession: SessionState, payload: RefreshTokenResponse): SessionState {
  return createSessionFromTokens(
    currentSession.user,
    currentSession.mustChangePassword,
    payload.accessToken,
    payload.refreshToken,
    payload.refreshTokenExpiresAt,
  );
}

export function markPasswordChanged(session: SessionState): SessionState {
  return {
    ...session,
    mustChangePassword: false,
    user: {
      ...session.user,
      mustChangePassword: false,
    },
  };
}

export function readSession() {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    cachedSessionRaw = null;
    cachedSessionValue = null;
    return null;
  }

  if (rawSession === cachedSessionRaw) {
    return cachedSessionValue;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as SessionState;
    cachedSessionRaw = rawSession;
    cachedSessionValue = parsedSession;
    return parsedSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    cachedSessionRaw = null;
    cachedSessionValue = null;
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

  const rawSession = JSON.stringify(session);
  cachedSessionRaw = rawSession;
  cachedSessionValue = session;
  window.localStorage.setItem(SESSION_STORAGE_KEY, rawSession);
  notifySessionChange();
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  cachedSessionRaw = null;
  cachedSessionValue = null;
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

  if (session.refreshTokenExpiresAt && now >= session.refreshTokenExpiresAt) {
    return true;
  }

  return now - session.lastActivityAt >= SESSION_TIMEOUT_MS;
}

export function shouldRefreshAccessToken(session: SessionState, thresholdMs = 60_000) {
  if (!session.expiresAt) {
    return false;
  }

  return session.expiresAt - Date.now() <= thresholdMs;
}

export { SESSION_TIMEOUT_MS };
