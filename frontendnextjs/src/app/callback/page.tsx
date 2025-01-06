"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processAccessToken = () => {
      const hash = window.location.hash.substring(1); 
      const params = new URLSearchParams(hash);


      const accessToken = params.get("access_token");
      console.log("Extracted access_token:", accessToken);

  
      if (!accessToken || accessToken.trim() === "") {
        console.warn("Missing or invalid access_token:", accessToken);
        toast.error("Authentication token is missing or invalid. Redirecting to login...");
        router.push("/auth/login"); 
        return;
      }

      try {
        
        console.log("Saving access_token to localStorage...");
        localStorage.setItem("access_token", accessToken);
        console.log("Access token successfully saved.");


        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/"); 
        }, 2000); 
      } catch (error) {

        console.error("Error saving access_token to localStorage:", error);
        toast.error("An error occurred while processing the access token.");
        router.push("/auth/login")
      }
    };

    processAccessToken();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <p className="text-lg font-semibold text-gray-600">
        Processing your login, please wait...
      </p>
    </div>
  );
}
