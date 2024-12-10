"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation schema
const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().min(3, "Password must be at least 3 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match!")
    .required("Confirm password is required"),
  refCode: Yup.string(), // Optional
});

// Form interface
interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  refCode: string;
}

export default function RegisterUser() {
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
      try {
        const res = await fetch("http://localhost:8000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await res.json();
        if (!res.ok) throw result;

        alert("Registration successful!");
      } catch (err: any) {
        console.error("Registration failed:", err);
      }
    },
  });

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Background */}
      <div
        className="bg-cover bg-center absolute inset-0 bg-black/50"
        style={{
          backgroundImage: "url('/concert1.jpg')",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      {/* Layout */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Register Card */}
        <div className="flex items-center justify-center w-full lg:w-1/2 mt-[5rem] md:mt-[6rem]">
          <div className="p-6 md:w-[60vw] w-[70vw] sm:p-8 md:p-12 max-w-md lg:max-w-lg bg-gradient-to-r from-black/90 to-black/50 text-white rounded-3xl shadow-xl border border-gray-400 backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
            <p className="text-sm mb-4">Create your account now!</p>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Username */}
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

              {/* Email */}
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

              {/* Password */}
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

              {/* Confirm Password */}
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

              {/* Referral Code */}
              <div>
                <label className="block mb-1">Referral Code</label>
                <input
                  type="text"
                  name="refCode" // Matches initialValues key
                  placeholder="Referral Code (optional)"
                  value={formik.values.refCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md text-white font-bold"
              >
                Register
              </button>
            </form>
          </div>
        </div>

        {/* Right Text Section */}
        <div className="flex items-center justify-center lg:justify-start w-full lg:w-1/2 mt-8 lg:mt-0 px-4 lg:px-0">
          <div className="text-white text-center lg:text-left max-w-lg">
            <h2 className="text-5xl font-bold mb-4">
              Join the Excitement With
              <span className="text-orange-400"> TIKO</span>
            </h2>
            <p className="text-sm mb-5">
              Register now and explore amazing events happening near you. Be the
              first to know about exclusive offers and updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
