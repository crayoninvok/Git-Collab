"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (values: { email: string }) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to send reset link!");

      toast.success("Password reset link sent to your email!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred while sending the reset link.";
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
          Forgot <span className="text-blue-400">Password</span>
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleForgotPassword}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:ring focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`w-full py-3 rounded-lg text-white font-bold transition-transform transform ${
                  isSubmitting || isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                }`}
              >
                {isSubmitting || isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <a href="/login" className="text-blue-400">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
