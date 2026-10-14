import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { 
      headers: { "Accept": "application/json" },
      credentials: "include" 
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (phone: string) => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) throw new Error("فشل في إرسال رمز التحقق");
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ phone, otp }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("رمز التحقق غير صحيح");
    const data = await res.json();
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    fetch("/api/auth/logout", { 
      method: "POST", 
      headers: { "Accept": "application/json" },
      credentials: "include" 
    }).then(() => {
      setUser(null);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, verifyOtp, logout, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
