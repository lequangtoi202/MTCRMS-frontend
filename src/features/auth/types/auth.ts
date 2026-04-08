export type LoginPayload = {
  mssq: string;
  password: string;
};

export type AuthUser = {
  id?: string;
  name?: string;
  role?: string;
  unitName?: string;
};

export type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  mustChangePassword?: boolean;
  user?: AuthUser;
};

export type SessionState = {
  accessToken?: string;
  refreshToken?: string;
  mustChangePassword: boolean;
  expiresAt: number | null;
  lastActivityAt: number;
  user: AuthUser | null;
};
