"use client";

import { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please input the username and password");
      return;
    }
    alert("Login successful redirect ke dashboard event kali ya");
  };

  return (
    <div className="h-screen bg-transparant relative">
      <div
        className="bg-cover bg-center absolute inset-0 bg-black/50"
        style={{
          backgroundImage: "url('/concert1.jpg')",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      <div className="relative flex flex-col md:flex-row items-center justify-between h-full px-10">
        <div className="flex items-center justify-center w-full md:w-1/2">
          <div className="p-8 md:p-12 lg:p-16 max-w-md md:max-w-lg lg:w-[70rem] items-end bg-gradient-to-r from-black/90 to-black/50 text-white rounded-3xl shadow-xl border border-gray-400 backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <p className="text-sm mb-4">Welcome back!</p>

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
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded-md bg-black/70 text-white border border-gray-500 focus:ring focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <input type="checkbox" id="rememberMe" className="mr-2" />
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
              >
                Login
              </button>
            </form>

            <div className="text-center my-4">Or</div>
            <div className="flex justify-between gap-4">
              <button className="w-full bg-red-500 py-2 rounded-md flex items-center justify-center">
                <FaGoogle className="mr-2" />
                Google
              </button>
              <button className="w-full bg-blue-600 py-2 rounded-md flex items-center justify-center">
                <FaFacebook className="mr-2" />
                Facebook
              </button>
            </div>

            <div className="text-center text-sm mt-4">
              Don't have an account?
              <a href="?" className="text-indigo-400">
                Signup
              </a>
            </div>

            <div className="mt-4 text-xs text-center">
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

        <div className="flex items-start justify-start w-full md:w-1/2">
          <div className="text-white text-start max-w-lg">
            <h2 className="text-4xl font-bold mb-4">
              Find Amazing Events Happening With
              <span className="text-orange-400"> TIKO</span>
            </h2>
            <p className="text-sm">
              Discover the best events in town and get exclusive access to
              tickets and updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
