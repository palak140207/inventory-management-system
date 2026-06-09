import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists on mount
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  // Login User
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register User
  const register = async (name, email, password, confirmPassword) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      localStorage.setItem("token", res.data.token);
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
