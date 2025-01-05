"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginSchema = Yup.object().shape({
  data: Yup.string().required("Username or Email is required"),
  password: Yup.string().required("Password is required"),
});

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function LoginPromotor() {
 

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { data: string; password: string }) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${base_url}/auth/promotorLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed!");

      // Save token to localStorage
      if (result.token) {
        localStorage.setItem("token", result.token);
      } else {
        throw new Error("Token not received from server");
      }

      toast.success("Login successful! Redirecting to dashboard...", {
        position: "bottom-right",
        autoClose: 3000,

        onClose: () => window.location.assign("/dashboard"),


      });
    } catch (err:unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during login.";
      toast.error(errorMessage || "An error occurred during login.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex items-center justify-center">
      <ToastContainer />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/concert1.jpg')",
          filter: "brightness(0.4)",
        }}
      ></div>

      {/* Login Container */}
      <div className="relative z-10 bg-gradient-to-br from-gray-800/90 to-black/70 backdrop-blur-md border border-gray-700 rounded-3xl p-8 lg:p-12 shadow-xl w-full max-w-[400px]">
        <h1 className="text-3xl font-bold mb-2">
          Login as <span className="text-blue-400">Promotor</span>
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Welcome back! Please login.
        </p>

        <Formik
          initialValues={{ data: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Username/Email Field */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Username / Email
                </label>
                <Field
                  name="data"
                  type="text"
                  placeholder="Enter your username or email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:ring focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="data"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:ring focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="password"
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
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
                }`}
              >
                {isSubmitting || isLoading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Extra Links */}
        <div className="mt-6 text-sm text-center">
          <p className="text-gray-400">
            Forgot password?{" "}
            <a href="/login/loginpromotor/forgotpasswordpromotor" className="text-indigo-400">
              Reset here
            </a>
          </p>
          <p className="mt-3 text-gray-400">

            Start register here{" "}
            <a href="/registerpromotor" className="text-indigo-400">
              Register promotor
            </a>
          </p>
          <p className="mt-3 text-gray-400">

            Not a Promotor?{" "}
            <a href="/login" className="text-indigo-400">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
