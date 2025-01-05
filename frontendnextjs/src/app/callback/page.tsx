"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processAccessToken = () => {
      const hash = window.location.hash.substring(1); // Remove the `#`
      const params = new URLSearchParams(hash);

      // Extract the access_token from the URL
      const accessToken = params.get("access_token");
      console.log("Extracted access_token:", accessToken);

      // Check if the access_token is valid
      if (!accessToken || accessToken.trim() === "") {
        console.warn("Missing or invalid access_token:", accessToken);
        toast.error("Authentication token is missing or invalid. Redirecting to login...");
        router.push("/auth/login"); // Redirect to login if access_token is invalid
        return;
      }

      try {
        // Save the access_token to localStorage
        console.log("Saving access_token to localStorage...");
        localStorage.setItem("access_token", accessToken);
        console.log("Access token successfully saved.");

        // Notify user of successful login
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/"); // Redirect to the homepage
        }, 2000); // 2-second delay before redirecting
      } catch (error) {
        // Handle errors while saving the access_token
        console.error("Error saving access_token to localStorage:", error);
        toast.error("An error occurred while processing the access token.");
        router.push("/auth/login"); // Redirect to login on error
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
