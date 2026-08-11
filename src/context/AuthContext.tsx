"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Researcher" | "Student";
  institution: string;
  department: string;
  orcid?: string;
  bio?: string;
  surveysManaged?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginUser: (userData: UserProfile) => void;
  logoutUser: () => void;
  updateUserProfile: (updatedFields: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      fetch("/api/auth/session")
        .then((response) => response.ok ? response.json() : null)
        .then((data) => setUser(data?.user || null))
        .catch(() => setUser(null));
    } catch {
      // Ignore
    }
  }, []);

  const loginUser = (userData: UserProfile) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
    fetch("/api/auth/session", { method: "DELETE" }).catch(() => undefined);
  };

  const updateUserProfile = async (updatedFields: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    const merged = { ...user, ...updatedFields };
    setUser(merged);
    // Sync with MongoDB backend
    try {
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      return res.ok;
    } catch {
      setUser(user);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginUser,
        logoutUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      loginUser: () => {},
      logoutUser: () => {},
      updateUserProfile: async () => true,
    };
  }
  return context;
};
