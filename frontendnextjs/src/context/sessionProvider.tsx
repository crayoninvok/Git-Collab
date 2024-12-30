"use client";

import { createContext, ReactNode, useEffect, useState, useCallback } from "react";
import {
  SessionContext as ISessionContext,
  UserType,
  IUser,
  IPromotor,
} from "@/types/event";


export const SessionContext = createContext<ISessionContext | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [isAuth, setIsAuth] = useState(false);
  const [type, setType] = useState<UserType | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [promotor, setPromotor] = useState<IPromotor | null>(null);
  const [loading, setLoading] = useState(true);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const resetSession = useCallback(() => {
    console.log("Resetting session state...");
    setIsAuth(false);
    setType(null);
    setUser(null);
    setPromotor(null);
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        throw new Error("No token found");
      }

      // Decode the token payload
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded Token Payload:", tokenPayload);

      // Check token expiration
      if (tokenPayload.exp * 1000 < Date.now()) {
        console.error("Token expired");
        throw new Error("Token expired");
      }

      // Fetch session from the backend
      const res = await fetch(`${base_url}/auth/session`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch session data from the server");
      }

      const result = await res.json();
      console.log("Session data from server:", result);

      // Update state based on the session data
      if (result.type === "promotor") {
        setPromotor(result);
        setType("promotor");
        setUser(null); // Ensure user is null if promotor is logged in
      } else if (result.type === "user") {
        setUser(result);
        setType("user");
        setPromotor(null); // Ensure promotor is null if user is logged in
      } else {
        throw new Error("Invalid session type received from the server");
      }

      setIsAuth(true);
    } catch (error) {
      console.error("Session check failed:", error);
      resetSession(); // Clear session on error
    } finally {
      setLoading(false);
    }
  }, [base_url, resetSession]);


  const logout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("token"); // Clear token from localStorage
    resetSession(); // Reset state
    window.location.href = "/login"; // Redirect to login page
  }, [resetSession]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkSession();
    } else {

      setLoading(false); // Skip session check if no token

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
