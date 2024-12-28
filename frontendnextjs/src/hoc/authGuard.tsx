"use client";

import { useSession } from "@/context/useSessionHook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function authGuard<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>
) {
  return function AuthGuardedComponent(props: P) {
    const { isAuth, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuth) {
        router.replace("/login");
      }
    }, [isAuth, loading, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold">Checking Authentication...</h1>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
