"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const token = Array.isArray(params?.token) ? decodeURIComponent(params.token[0]) : decodeURIComponent(params.token || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("resetToken", token);
      setStoredToken(token);
    } else {
      const savedToken = localStorage.getItem("resetToken");
      if (savedToken) {
        setStoredToken(savedToken);
      } else {
        toast.error("No reset token found. Redirecting to login...", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => router.push("/login/loginuser"),
        });
      }
    }
  }, [token, router]);

  const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
    setIsLoading(true);

    if (!storedToken) {
      toast.error("No valid reset token. Please try resetting your password again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const decodedToken = decodeURIComponent(storedToken);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: decodedToken,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Password reset failed!");

      toast.success("Password reset successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => {
          localStorage.removeItem("resetToken");
          router.push("/login/loginuser");
        },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <ToastContainer />
      <div className="bg-gradient-to-br from-gray-800/90 to-black/70 backdrop-blur-md border border-gray-700 rounded-3xl p-8 lg:p-12 shadow-xl w-full max-w-[400px]">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Reset <span className="text-blue-400">Password</span>
        </h1>
        <p className="text-gray-400 text-center mb-6">Enter your new password below.</p>
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleResetPassword}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:ring focus:ring-blue-500"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:ring focus:ring-blue-500"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`w-full py-3 rounded-lg text-white font-bold transition-transform transform ${
                  isSubmitting || isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                }`}
              >
                {isSubmitting || isLoading ? "Resetting Password..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <a href="/login/loginuser" className="text-blue-400">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
