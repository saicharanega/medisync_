import { createContext } from "react";
import { User, UserRole } from "@/types";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => false,
  register: () => false,
  logout: () => undefined,
  switchRole: () => undefined,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
AuthContext.displayName = "AuthContext";
