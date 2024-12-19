    "use client";

    import { createContext, ReactNode, useContext, useEffect, useState } from "react";
    import { deleteCookie } from "@/libs/action";

    interface IUser {
      id: string;
      username: string;
      email: string;
      refCode: string
      avatar: string | null;
      points: number
      userCouponId: number
      percentage: number
      userCoupon: string
    }

    interface IPromotor {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    }

    type UserType = "user" | "promotor";

    interface SessionContext {
      isAuth: boolean;
      type: UserType | null;
      user: IUser | null;
      promotor: IPromotor | null;
      checkSession: () => Promise<void>;
      logout: () => void;
    }

    const SessionContext = createContext<SessionContext | undefined>(undefined);

    export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
      const [isAuth, setIsAuth] = useState(false);
      const [type, setType] = useState<UserType | null>(null);
      const [user, setUser] = useState<IUser | null>(null);
      const [promotor, setPromotor] = useState<IPromotor | null>(null);
      const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE

      const checkSession = async () => {
        try {
          const res = await fetch(`${base_url}/auth/session`, {
            method: "GET",
            credentials: "include",
          });

          if (!res.ok) throw new Error("Failed to fetch session");

          const result = await res.json();

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
        }
      };

      const logout = () => {
        deleteCookie("token");
        resetSession();
        setIsAuth(false)
        setUser(null)
        setPromotor(null)
      };

      const resetSession = () => {
        setIsAuth(false);
        setType(null);
        setUser(null);
        setPromotor(null);
      };
      

      useEffect(() => {
        checkSession();
      }, []);

      return (
        <SessionContext.Provider value={{ isAuth, type, user, promotor, checkSession, logout }}>
          {children}
        </SessionContext.Provider>
      );
    };

    export const useSession = (): SessionContext => {
      const context = useContext(SessionContext);
      if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
      }
      return context;
    };


