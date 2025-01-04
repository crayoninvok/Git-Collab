"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaFacebook, FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginSchema = Yup.object().shape({
  data: Yup.string().required("Username or Email is required"),
  password: Yup.string().required("Password is required"),
});

interface FormValues {
  data: string;
  password: string;
}

export default function LoginUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAlertMessage(null);

    try {
      const res = await fetch(`${base_url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed!");

      // Save token to localStorage
      localStorage.setItem("token", result.token);

      toast.success("Login successful! Redirecting...", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });

      // Redirect
      setTimeout(() => {
        window.location.assign("/");
      }, 1000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during login.";
      setAlertMessage(errorMessage || "An error occurred");
      toast.error(errorMessage || "An error occurred", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${base_url}/oauth/login/google`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to initiate Google login");
      }

      // Redirecting the user to Google's OAuth URL
      const result = await res.json();
      window.location.href = result.url; // Ensure backend sends the redirect URL
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during Google login.";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
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

      {/* Login */}
      <div className="relative z-10 w-full lg:w-[70%] xl:w-[60%] flex flex-col lg:flex-row items-center justify-between space-y-10 lg:space-y-0 lg:space-x-10">
        {/* Info Section */}
        <div className="text-center lg:text-left max-w-lg">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 mt-[10vh] md:mt-0 lg:mt-0">
            Find Amazing Events with{" "}
            <span className="text-orange-400">TIKO</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Discover the best events in town and get exclusive access to tickets
            and updates!
          </p>
        </div>

        {/* Login Section */}
        <div className="w-full sm:w-[90%] lg:w-[50%] bg-gray-900/70 bg-opacity-90 rounded-3xl shadow-lg p-6 sm:p-8 md:p-12 border border-gray-600 backdrop-blur-lg">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-sm text-gray-400 mb-6">Welcome back!</p>

          {alertMessage && (
            <div className="flex items-center bg-red-500 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-md space-x-3 mb-4">
              <FaTimes className="text-xl" />
              <span>{alertMessage}</span>
            </div>
          )}

          <Formik
            initialValues={{ data: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username / Email
                  </label>
                  <Field
                    name="data"
                    type="text"
                    placeholder="Enter your username or email"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                  />
                  <ErrorMessage
                    name="data"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <Field type="checkbox" className="mr-2" />
                    Remember me
                  </label>
                  <a href="/login/loginuser/forgotpassworduser" className="text-sm text-indigo-400">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-white font-bold flex items-center justify-center transition-transform transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="spinner-border animate-spin w-5 h-5 border-4 border-t-transparent rounded-full"></div>
                  ) : (
                    "Login"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400">Or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="text-2xl" />
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg flex items-center justify-center text-white transition-transform transform hover:scale-105">
              <FaFacebook className="text-2xl" />
            </button>
          </div>

          <div className="text-center text-sm mt-6">
            Don&apos;t have an account?{" "}
            <a href="/registeruser" className="text-indigo-400">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
