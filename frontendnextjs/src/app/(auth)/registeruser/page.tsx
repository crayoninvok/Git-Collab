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
  refCode: Yup.string(), // Optional
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

  const initialValues: FormValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    refCode: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Registration failed");

        Swal.fire({
          title: "Success!",
          text: result.message || "Registration successful!",
          icon: "success",
          confirmButtonText: "Great!",
        });
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err.message || "Registration failed!",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Registration failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-transparent relative">
      <div
        className="bg-cover bg-center absolute inset-0 bg-black/50"
        style={{
          backgroundImage: "url('/concert1.jpg')",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full px-6 sm:px-8 md:px-12 lg:px-20">
        <div className="flex items-center justify-center w-full lg:w-1/2 mt-[5rem] md:mt-[6rem]">
          <div className="p-6 md:w-[60vw] w-[70vw] sm:p-8 md:p-12 max-w-md lg:max-w-lg bg-gradient-to-r from-black/90 to-black/50 text-white rounded-3xl shadow-xl border border-gray-400 backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
            <p className="text-sm mb-4">Create your account now!</p>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.username}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>
              <div>
                <label className="block mb-1">Referral Code</label>
                <input
                  type="text"
                  name="refCode"
                  placeholder="Referral Code (optional)"
                  value={formik.values.refCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2 rounded-md text-white font-bold ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}