import { ReactNode, useCallback, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { User, UserRole } from "@/types";

const mockUsers: Record<string, User> = {
  patient: { id: "user-1", name: "Alex Rivera", email: "alex@example.com", role: "patient", phone: "+1 555-0142" },
  doctor: { id: "dr-1", name: "Dr. Sarah Mitchell", email: "sarah@medisync.com", role: "doctor" },
  admin: { id: "admin-1", name: "Admin", email: "admin@medisync.com", role: "admin" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string, role?: UserRole) => {
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

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout, switchRole }),
    [user, login, register, logout, switchRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
