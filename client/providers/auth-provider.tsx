"use client";

import { createContext, useContext } from "react";
import type { User } from "@/types/auth";
import { useCurrentUserQuery } from "@/hooks/use-auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useCurrentUserQuery();
  const user = data ?? null;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin: !!user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used within an AuthProvider");
  }
  return ctx;
}
