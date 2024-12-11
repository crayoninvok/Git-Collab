"use client"

import { IPromotor } from "@/types/event";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface SessionContextPromotor {
  isAuth: boolean;
  promotor: IPromotor | null;
  setIsAuth: (isAuth: boolean) => void;
  setPromotor: (promotor: IPromotor | null) => void;
  checkSession: () => Promise<void>; 
}

const SessionContext = createContext<SessionContextPromotor | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [promotor, setPromotor] = useState<IPromotor | null>(null);

  const checkSession = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/promotors/profile", {
        method: "GET",
        credentials: "include", 
      });

      if (!res.ok) {
        throw new Error("Failed to fetch session");
      }

      const result = await res.json();
      setPromotor(result);
      setIsAuth(true);
    } catch (err) {
      console.error("Error checking session:", err);
      setIsAuth(false);
      setPromotor(null);
    }
  };

  useEffect(() => {
    checkSession(); // Call the function in useEffect
  }, []);

  return (
    <SessionContext.Provider
      value={{ isAuth, promotor, setIsAuth, setPromotor,checkSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextPromotor => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
