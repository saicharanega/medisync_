import { createContext } from "react";











export const defaultAuthContext = {
  user: null,
  isAuthenticated: false,
  login: () => false,
  register: () => false,
  logout: () => undefined,
  switchRole: () => undefined
};

export const AuthContext = createContext(defaultAuthContext);
AuthContext.displayName = "AuthContext";