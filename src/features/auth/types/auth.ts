export type LoginPayload = {
  mssq: string;
  password: string;
};

export type AuthUser = {
  id: string;
  mssq: string;
  fullName: string;
  status: string;
  roleCode: string | null;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
};

export type SessionState = {
  accessToken: string;
  refreshToken: string;
  mustChangePassword: boolean;
  expiresAt: number | null;
  lastActivityAt: number;
  user: AuthUser;
};
