import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, User> = {
  patient: { id: "user-1", name: "Alex Rivera", email: "alex@example.com", role: "patient", phone: "+1 555-0142" },
  doctor: { id: "dr-1", name: "Dr. Sarah Mitchell", email: "sarah@medisync.com", role: "doctor" },
  admin: { id: "admin-1", name: "Admin", email: "admin@medisync.com", role: "admin" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string, role?: UserRole) => {
    // Mock login - in production this would hit the backend
    const targetRole = role || (email.includes("admin") ? "admin" : email.includes("doctor") || email.includes("dr") ? "doctor" : "patient");
    const mockUser = mockUsers[targetRole] || mockUsers.patient;
    setUser({ ...mockUser, email });
    return true;
  }, []);

  const register = useCallback((name: string, email: string, _password: string) => {
    setUser({ id: `user-${Date.now()}`, name, email, role: "patient" });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const switchRole = useCallback((role: UserRole) => {
    const mockUser = mockUsers[role];
    if (mockUser) setUser(mockUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
