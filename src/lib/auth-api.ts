import {
  clearAuthStorage,
  normalizeAuthUser,
  setStoredToken,
  setStoredUser,
  type AuthUser,
} from "@/lib/auth-storage";
import { pcPartsRequest } from "@/lib/pc-parts-client";

type AuthSessionPayload = {
  user: unknown;
  token: string;
};

type AuthResponse = {
  success: boolean;
  data: AuthSessionPayload;
  message?: string;
};

type MeResponse = {
  success: boolean;
  data: unknown;
};

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}): Promise<AuthUser> {
  const res = await pcPartsRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: input,
  });

  const user = normalizeAuthUser(res.data?.user);
  const token = res.data?.token;
  if (!user || !token) {
    throw new Error("Бүртгэл амжилтгүй — хариу буруу байна");
  }

  setStoredToken(token);
  setStoredUser(user);
  return user;
}

export async function loginUser(input: {
  username: string;
  password: string;
}): Promise<AuthUser> {
  const res = await pcPartsRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: input,
  });

  const user = normalizeAuthUser(res.data?.user);
  const token = res.data?.token;
  if (!user || !token) {
    throw new Error("Нэвтрэх амжилтгүй — хариу буруу байна");
  }

  setStoredToken(token);
  setStoredUser(user);
  return user;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await pcPartsRequest<MeResponse>("/api/auth/me", { auth: true });
  const user = normalizeAuthUser(res.data);
  if (!user) {
    throw new Error("Хэрэглэгчийн мэдээлэл олдсонгүй");
  }
  setStoredUser(user);
  return user;
}

export function logoutUser(): void {
  clearAuthStorage();
}
