"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/auth-api";
import { getStoredToken, getStoredUser, type AuthUser } from "@/lib/auth-storage";
import { fetchOrders } from "@/lib/orders-api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  orderItemCount: number;
  login: (username: string, password: string) => Promise<void>;
  register: (input: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  refreshOrderCount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderItemCount, setOrderItemCount] = useState(0);

  const refreshOrderCount = useCallback(async () => {
    if (!getStoredToken()) {
      setOrderItemCount(0);
      return;
    }
    try {
      const res = await fetchOrders({ limit: 50, status: "pending" });
      const count = (res.data ?? []).reduce(
        (sum, order) =>
          sum + order.items.reduce((s, item) => s + item.quantity, 0),
        0,
      );
      setOrderItemCount(count);
    } catch {
      setOrderItemCount(0);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setOrderItemCount(0);
      return;
    }
    try {
      const me = await fetchCurrentUser();
      setUser(me);
      await refreshOrderCount();
    } catch {
      logoutUser();
      setUser(null);
      setOrderItemCount(0);
    }
  }, [refreshOrderCount]);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);

    void (async () => {
      try {
        if (getStoredToken()) {
          await refreshSession();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshSession]);

  const login = useCallback(
    async (username: string, password: string) => {
      const u = await loginUser({ username, password });
      setUser(u);
      await refreshOrderCount();
    },
    [refreshOrderCount],
  );

  const register = useCallback(
    async (input: {
      username: string;
      email: string;
      password: string;
      displayName?: string;
    }) => {
      const u = await registerUser(input);
      setUser(u);
      await refreshOrderCount();
    },
    [refreshOrderCount],
  );

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setOrderItemCount(0);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      orderItemCount,
      login,
      register,
      logout,
      refreshSession,
      refreshOrderCount,
    }),
    [
      user,
      loading,
      orderItemCount,
      login,
      register,
      logout,
      refreshSession,
      refreshOrderCount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
