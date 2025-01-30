import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  name: string;
    userId: string;
    email: string;
    status: string;
    
}

interface AuthState {
  name: string | null;
    userId: string | null;
    email: string | null;
    status: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({ name: null , userId: null, email: null, status: null });

  const login = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setAuthState({ name: decoded.name, userId: decoded.userId, email: decoded.email, status: decoded.status });
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Invalid token", error);
    }
  };

  const logout = () => {
    setAuthState({ name: null, userId: null, email: null, status: null });
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      login(token);
    }
  }, [URL]);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
