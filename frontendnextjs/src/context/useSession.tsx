"use client";

import React, { createContext, ReactNode, useEffect, useState, useContext } from "react";
import { IUser } from "@/types/event";

interface SessionContextProps {
  isAuth: boolean;
  user: IUser | null; // User can be null if not authenticated
  setIsAuth: (isAuth: boolean) => void;
  setUser: (user: IUser | null) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  const checkSession = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/profile", {
        method: "GET",
        credentials: "include", 
      });
      const result = await res.json();
      if (!res.ok) throw result; 

      // Set the authenticated user
      setUser(result.user);
      setIsAuth(true);
    } catch (err) {
      console.error("Error fetching session:", err);
      setUser(null); 
      setIsAuth(false); 
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SessionContext.Provider value={{ isAuth, user, setIsAuth, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook to use session context
export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
