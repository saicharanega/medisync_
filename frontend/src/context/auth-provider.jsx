import { useCallback, useMemo, useState, useEffect } from "react";
import { AuthContext } from "./auth-context";
import axios from "axios";
import { toast } from "sonner";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser({ ...res.data, token }))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      toast?.error(err.response?.data?.message || "Login failed");
      return null;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const res = await axios.post("/api/auth/register", { name, email, password, role: "patient" });
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const googleLogin = useCallback(async (token) => {
    try {
      const res = await axios.post("/api/auth/google", { token });
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      toast?.error(err.response?.data?.message || "Google authentication failed");
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const switchRole = useCallback(() => {
    console.warn("switchRole is disabled in production MERN mode.");
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, googleLogin, logout, switchRole }),
    [user, login, register, googleLogin, logout, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}