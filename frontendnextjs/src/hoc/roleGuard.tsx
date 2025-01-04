"use client";

import { useSession } from "@/context/useSessionHook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const roleGuard = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  allowedRoles: string[] // Accept an array of strings
) => {
  return (props: P) => {
    const { user, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace("/login"); // Redirect to login if not authenticated
        } else if (!allowedRoles.includes(user.type)) {
          router.replace("/not-authorized"); // Redirect if role is not allowed
        }
      }
    }, [user, loading, allowedRoles, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold">Checking Authorization...</h1>
        </div>
      );
    }

    return user && allowedRoles.includes(user.type) ? (
      <Component {...props} />
    ) : null;
  };
};

export default roleGuard;
