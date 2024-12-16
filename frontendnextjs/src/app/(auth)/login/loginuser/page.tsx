"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaFacebook, FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAlertMessage(null);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed!");
      toast.success("Login successful! Redirecting...", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setTimeout(() => {
        window.location.assign("/");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setAlertMessage(err.message || "An error occurred");
      toast.error(err.message || "An error occurred", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <ToastContainer />

      <div
        className="bg-cover bg-center absolute inset-0 bg-black/50"
        style={{
          backgroundImage: "url('/concert1.jpg')",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full px-6 sm:px-8 md:px-12 lg:px-20 p-10 lg:p-[3%]">
        <div className="flex items-center justify-center w-full lg:w-1/2 mt-[5rem] md:mt-[12rem]">
          <div className="p-6 md:w-[60vw] w-[70vw] sm:p-8 md:p-12 max-w-md lg:max-w-lg bg-gradient-to-r from-black/80 to-black/50 text-white rounded-3xl shadow-2xl border border-gray-300 backdrop-blur-lg">
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <p className="text-sm mb-4">Welcome back!</p>

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
                <Form className="space-y-4">
                  <div>
                    <label className="block mb-1">Username / Email</label>
                    <Field
                      name="data"
                      type="text"
                      placeholder="Username or Email"
                      className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                    />
                    <ErrorMessage
                      name="data"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Password</label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Field
                        type="checkbox"
                        name="rememberMe"
                        className="mr-2"
                      />
                      <label htmlFor="rememberMe" className="text-sm">
                        Remember me
                      </label>
                    </div>
                    <a href="?" className="text-sm text-indigo-400">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md text-white font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-2 text-gray-400">Or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="flex sm:flex-row justify-between gap-4">
              <button className="w-full bg-transparent py-2 rounded-full flex items-center justify-end">
                <FcGoogle className="text-5xl" />
              </button>
              <button className="w-full bg-transparent py-2 rounded-full flex items-center justify-start">
                <FaFacebook className="text-5xl text-blue-600" />
              </button>
            </div>

            <div className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <a href="/registeruser" className="text-indigo-400 ml-1">
                Signup
              </a>
            </div>

            <div className="mt-4 text-xs text-center space-x-2">
              <a href="?" className="text-gray-400 hover:text-gray-300">
                Terms & Conditions
              </a>
              <a href="?" className="text-gray-400 hover:text-gray-300">
                Support
              </a>
              <a href="?" className="text-gray-400 hover:text-gray-300">
                Customer Care
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-start w-full lg:w-1/2 mt-8 lg:mt-0 px-4 lg:px-0">
          <div className="text-white text-center lg:text-left max-w-lg">
            <h2 className="text-5xl font-bold mb-4 md:mt-[10rem]">
              Find Amazing Events Happening With
              <span className="text-orange-400"> TIKO</span>
            </h2>
            <p className="text-sm mb-5">
              Discover the best events in town and get exclusive access to
              tickets and updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
