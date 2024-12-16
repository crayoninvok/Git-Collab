"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match!")
    .required("Confirm password is required"),
  refCode: Yup.string(),
});

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  refCode: string;
}

export default function RegisterUser() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (user: FormValues) => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const result = await res.json();
      if (!res.ok) throw result;
      

      Swal.fire({
        title: "Registration Successful!",
        text: "Welcome to TIKO! Please check your email for verification.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#f97316", // Tailwind orange-500 color
      });
    
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        title: "Registration Failed",
        text: err.message || "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626", // Tailwind red-600 color
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      refCode: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      handleAdd(values);
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed bg-black/50"
        style={{
          backgroundImage: "url('/concert1.jpg')",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full px-6 sm:px-8 md:px-12 lg:px-20 max-w-5xl">
        <div className="hidden lg:flex flex-col justify-center w-full lg:w-1/2 text-left text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Join <span className="text-orange-400">TIKO</span> Today
          </h1>
          <p className="text-gray-300 text-lg">
            Explore amazing events, connect with people, and build experiences
            like never before.
          </p>
        </div>

        <div className="w-full lg:w-1/2 bg-gradient-to-br from-black/90 via-gray-800 to-black/70 text-white rounded-3xl p-8 sm:p-10 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.username}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                Referral Code
              </label>
              <input
                type="text"
                name="refCode"
                placeholder="Referral Code (optional)"
                value={formik.values.refCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-lg font-semibold transition-all ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
