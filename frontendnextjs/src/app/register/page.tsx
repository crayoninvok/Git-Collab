"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all the fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Registration successful! Redirecting...");
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* BG */}
      <div
        className="bg-cover bg-center absolute inset-0 bg-black/50"
        style={{
          backgroundImage: "url('/concert1.jpg')",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      {/* DIV KANAN KIRI */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full px-6 sm:px-8 md:px-12 lg:px-20">
        {/* REGISTER CARD */}
        <div className="flex items-center justify-center w-full lg:w-1/2 mt-[5rem] md:mt-[6rem]">
          <div className="p-6 md:w-[60vw] w-[70vw] sm:p-8 md:p-12 max-w-md lg:max-w-lg bg-gradient-to-r from-black/90 to-black/50 text-white rounded-3xl shadow-xl border border-gray-400 backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-2">Signup</h1>
            <p className="text-sm mb-4">Create your account now!</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-1">Reveral Code</label>
                <input
                  type="reveralcode"
                  placeholder="Reveral Code (optional if you have)"
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md text-white font-bold"
              >
                Register
              </button>
            </form>

            <div className="text-center text-sm mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-400">
                Login
              </a>
            </div>

            <div className="mt-4 text-xs text-center space-x-3">
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

        {/*  TEXT KANAN */}
        <div className="flex items-center justify-center lg:justify-start w-full lg:w-1/2 mt-8 lg:mt-0 px-4 lg:px-0">
          <div className="text-white text-center lg:text-left max-w-lg">
            <h2 className="text-5xl font-bold mb-4 md:mt-[10rem]">
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
