export const AUTH_TOKEN_KEY = "token";
export const AUTH_USER_KEY = "auth_user";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  displayName?: string;
};

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthStorage(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function normalizeAuthUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = String(r.id ?? r._id ?? "");
  const username = typeof r.username === "string" ? r.username : "";
  const email = typeof r.email === "string" ? r.email : "";
  if (!id || !username) return null;
  return {
    id,
    username,
    email,
    displayName:
      typeof r.displayName === "string" && r.displayName.trim()
        ? r.displayName.trim()
        : undefined,
  };
}
