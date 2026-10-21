"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiFetch,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from "@/lib/api";

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  rol: "ADMIN" | "CONDUCTOR";
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const savedToken = getStoredToken();
      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);
      try {
        const profile = await apiFetch<UserProfile>("/auth/me");
        setUser(profile);
      } catch {
        removeStoredToken();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    const res = await apiFetch<{
      accessToken: string;
      user: UserProfile;
    }>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setStoredToken(res.accessToken);
    setToken(res.accessToken);
    setUser(res.user);
    router.push("/dashboard");
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, loginAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
}
