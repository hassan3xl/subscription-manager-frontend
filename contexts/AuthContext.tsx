"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { resetAuthCookies } from "@/actions/auth.actions";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_user="));
      if (cookies) {
        const value = cookies.split("=")[1];
        const parsed = JSON.parse(decodeURIComponent(value));
        setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to parse session_user cookie", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    await resetAuthCookies();
    setUser(null);
    window.location.href = "/"; // redirect after logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
