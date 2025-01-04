"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  SessionContext as ISessionContext,
  UserType,
  IUser,
  IPromotor,
} from "@/types/event";

export const SessionContext = createContext<ISessionContext | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [type, setType] = useState<UserType | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [promotor, setPromotor] = useState<IPromotor | null>(null);
  const [loading, setLoading] = useState(true);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const checkSession = useCallback(async () => {
    try {
      console.log("Starting session check...");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Decode token and check expiration
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token Payload:", tokenPayload);

      if (tokenPayload.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }

      const res = await fetch(`${base_url}/auth/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch session");
      }

      const result = await res.json();
      console.log("Session API Response:", result);

      if (result.type === "promotor") {
        setPromotor(result);
        setType("promotor");
        setUser(null);
      } else if (result.type === "user") {
        setUser(result);
        setType("user");
        setPromotor(null);
      } else {
        throw new Error("Invalid session type");
      }

      setIsAuth(true);
    } catch (error) {
      console.error("Session check failed:", error);
      resetSession();
    } finally {
      setLoading(false);
    }
  }, [base_url]);

  const logout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    resetSession();
    window.location.href = "/login";
  }, []);

  const resetSession = useCallback(() => {
    console.log("Resetting session...");
    setIsAuth(false);
    setType(null);
    setUser(null);
    setPromotor(null);
  }, []);

  useEffect(() => {
    console.log("Initializing session provider...");
    const token = localStorage.getItem("token");
    if (token) {
      checkSession();
    } else {
      setLoading(false);
    }
  }, [checkSession]);

  return (
    <SessionContext.Provider
      value={{
        isAuth,
        type,
        user,
        promotor,
        checkSession,
        logout,
        loading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
