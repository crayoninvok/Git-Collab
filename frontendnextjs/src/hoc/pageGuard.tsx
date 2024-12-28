"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionProvider";

/**
 * A Higher-Order Component (HOC) to guard routes based on authentication and roles.
 *
 * @param Component - The component to render if access is granted.
 * @param options - Configuration options:
 *   - `requiredRole`: The role required to access the component.
 *   - `redirectTo`: The route to redirect unauthenticated users.
 */
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
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            {/* Spinner */}
            <svg
              className="animate-spin h-10 w-10 text-orange-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            {/* Message */}
            <h1 className="text-3xl font-bold text-orange-500 mt-4">
              Checking Authorization...
            </h1>
          </div>
        </div>
      );
    }

    if (!isAuth || (requiredRole && type !== requiredRole)) {
      return null; // Prevent rendering while redirecting
    }

    return <Component {...props} />;
  };
}
