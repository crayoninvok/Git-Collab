"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionProvider";
import Loading from "@/app/loading"; // Adjust the path based on your project structure

export default function withGuard<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
  options: { requiredRole?: "user" | "promotor"; redirectTo?: string } = {}
) {
  const { requiredRole, redirectTo = "/login" } = options;

  return function GuardedComponent(props: P) {
    const { isAuth, loading, type } = useContext(SessionContext) || {};
    const router = useRouter();

    useEffect(() => {
      console.log("Guard State:", { isAuth, loading, type, requiredRole });

      if (!loading) {
        if (!isAuth) {
          console.warn("User is not authenticated. Redirecting to login.");
          router.replace(redirectTo);
        } else if (requiredRole && type !== requiredRole) {
          console.warn(`Role mismatch: required ${requiredRole}, got ${type}`);
          router.replace("/not-authorized");
        }
      }
    }, [isAuth, loading, type, router, requiredRole, redirectTo]);

    if (loading) {
      return <Loading message="Checking Authorization..." />;
    }

    if (!isAuth || (requiredRole && type !== requiredRole)) {
      return null; 
    }

    return <Component {...props} />;
  };
}
