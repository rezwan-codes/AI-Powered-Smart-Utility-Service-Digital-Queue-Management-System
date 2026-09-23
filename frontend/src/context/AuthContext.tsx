import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { User } from "../types/utility";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  setSession: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  initialized: false,
  setSession: () => {},
  updateUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smartUtilityToken"));
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const stored = localStorage.getItem("smartUtilityToken");

    if (!stored) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    setToken(stored);
    authService.me()
      .then(({ user }) => {
        if (!cancelled) {
          setUser(user);
          setLoading(false);
          setInitialized(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem("smartUtilityToken");
          localStorage.removeItem("role");
          setUser(null);
          setToken(null);
          setLoading(false);
          setInitialized(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("smartUtilityToken");
    localStorage.removeItem("role");
    setUser(null);
    setToken(null);
    setInitialized(true);
    setLoading(false);
  };

  const setSession = (nextUser: User, nextToken: string) => {
    localStorage.setItem("smartUtilityToken", nextToken);
    localStorage.setItem("role", nextUser.role.toLowerCase() === "citizen" ? "citizen" : nextUser.role.toLowerCase());
    setUser(nextUser);
    setToken(nextToken);
    setInitialized(true);
    setLoading(false);
  };

  const updateUser = (nextUser: User) => {
    setUser(nextUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, initialized, setSession, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
