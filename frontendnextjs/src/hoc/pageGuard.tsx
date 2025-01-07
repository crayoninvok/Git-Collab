"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionProvider";
import Loading from "@/app/loading";

interface GuardOptions {
  requiredRole?: "user" | "promotor";
  redirectTo?: string;
  routeRedirects?: {
    [route: string]: string; // Define specific redirects for routes
  };
}

export default function withGuard<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
  options: GuardOptions = {}
) {
  const { requiredRole, redirectTo = "/login", routeRedirects = {} } = options;

  return function GuardedComponent(props: P) {
    const { isAuth, loading, type } = useContext(SessionContext) || {};
    const router = useRouter();

    useEffect(() => {
      console.log("Guard State:", { isAuth, loading, type, requiredRole });

      if (!loading) {
        const currentRoute = window.location.pathname;

        if (!isAuth) {
          console.warn("User is not authenticated. Redirecting to login.");
          router.replace(routeRedirects[currentRoute] || redirectTo);
        } else if (requiredRole && type !== requiredRole) {
          const redirectPath = routeRedirects[currentRoute] || "/not-authorized";
          console.warn(`Role mismatch: required ${requiredRole}, got ${type}`);
          router.replace(redirectPath);
        }
      }
    }, [isAuth, loading, type, router, requiredRole, redirectTo, routeRedirects]);

    if (loading) {
      return <Loading message="Checking Authorization..." />;
    }

    if (!isAuth || (requiredRole && type !== requiredRole)) {
      return null;
    }

    return <Component {...props} />;
  };
}
