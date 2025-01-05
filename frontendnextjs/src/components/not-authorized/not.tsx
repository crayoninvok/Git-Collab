"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface NotAuthorizedProps {
  title?: string;
  description?: string;
}

export default function NotAuthorized({ 
  title = "Authentication Required",
  description = "Please sign in to view event details and purchase tickets."
}: NotAuthorizedProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="max-w-md w-full p-8 rounded-lg bg-zinc-900 space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-orange-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        
        <p className="text-gray-400">
          {description}
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/login/loginuser")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
          >
            Sign In
          </Button>
          
          <Button
            onClick={() => router.push("/registeruser")}
            className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10"
          >
            Create Account
          </Button>
        </div>

        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}