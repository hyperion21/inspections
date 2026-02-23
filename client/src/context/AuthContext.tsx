import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { baseFetch } from "../api/baseFetch";
import type { AuthContextType, JwtPayload } from "../types/auth";
import type { User } from "../types/user";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setInitialized(true);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 < Date.now()) throw new Error("Token expired");

        const data = await baseFetch("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          employeeId: data.employeeId,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Token verification failed:", err);
        logout();
      } finally {
        setInitialized(true);
      }
    };

    void verifyToken();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updatedUser });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
