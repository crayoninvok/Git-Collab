"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct hook import
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const LoginSchema = Yup.object().shape({
  data: Yup.string().required("Username or Email is required"),
  password: Yup.string().required("Password is required"),
});

interface FormValues {
  data: string;
  password: string;
}


const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE
export default function LoginPromotor() {
 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${base_url}/auth/promotorLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed!");

      // Display success toast
      toast.success("Login successful! Redirecting to dashboard...", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      console.error(err);

      // Display error toast
      toast.error(err.message || "An error occurred during login.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/concert1.jpg')",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Toast container */}
      <ToastContainer />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-[90%] lg:w-[80%] max-w-[1200px] space-y-10 lg:space-y-0">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 lg:p-12 shadow-xl w-full lg:w-[40%] border border-b-gray-400">
          <h1 className="text-4xl font-bold text-white mb-2">
            Login as <span className="text-blue-500">Promotor</span>
          </h1>
          <p className="text-gray-400 mb-6">Welcome back!</p>

          <Formik
            initialValues={{ data: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Username / Email
                  </label>
                  <Field
                    name="data"
                    type="text"
                    placeholder="Enter your username or email"
                    className="w-full px-4 py-2 rounded-md bg-black/70 text-white border border-gray-600 focus:ring focus:ring-indigo-500"
                  />
                  <ErrorMessage
                    name="data"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 rounded-md bg-black/70 text-white border border-gray-600 focus:ring focus:ring-indigo-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded text-indigo-500 focus:ring focus:ring-indigo-500"
                      />
                      <span>Remember me</span>
                    </label>
                  </div>
                  <a href="#" className="text-indigo-400 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`w-full py-3 rounded-lg text-white font-bold transition ${
                    isSubmitting || isLoading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isSubmitting || isLoading ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex gap-4 p-4">
            <hr className="mt-3 border-1 w-1/2" />
            <h1 className="text-white">OR</h1>
            <hr className="mt-3 border-1 w-1/2" />
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button className="flex items-center px-4 py-2">
              <FcGoogle className="mr-2 text-5xl" />
            </button>
            <button className="justify-center w-auto text-white bg-transparant">
              <FaFacebook className="mr-2 text-5xl text-blue-500" />
            </button>
          </div>
          <div className="text-center text-gray-400 mt-6 text-sm">
            Don't have an account?{" "}
            <a
              href="/registerpromotor"
              className="text-indigo-400 hover:underline"
            >
              Signup
            </a>
          </div>
          <div className="flex justify-between text-white p-2">
            <h1 className="text-[14px]">terms and condition</h1>
            <h1 className="text-[14px]">support</h1>
            <h1 className="text-[14px]">customer care</h1>
          </div>
        </div>

        <div className="text-center lg:text-left lg:w-[50%] text-white">
          <h1 className="text-5xl font-bold leading-snug">
            Create Great Events Happening With{" "}
            <span className="text-orange-500">TIKO</span>
          </h1>
          <p className="text-gray-300 mt-4 text-lg">
            Discover the best management event website get exclusive access to
            manage some event!
          </p>
        </div>
      </div>
    </div>
  );
}
