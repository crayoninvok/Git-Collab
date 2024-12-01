"use client";

import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaTimes } from "react-icons/fa";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setAlertMessage("Please input the username and password");
      return;
    }

    if (password !== "correct_password") {
      setAlertMessage("Sorry, that password isn't right");
      return;
    }

    alert("Login successful! Redirecting to the dashboard...");
    setAlertMessage(null); // Clear alert on successful login
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

 
      <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full px-6 sm:px-8 md:px-12 lg:px-20">
        {/* CARD LOGIN */}
        <div className="flex items-center justify-center w-full lg:w-1/2 mt-[5rem] md:mt-[12rem]">
          <div className="p-6 md:w-[60vw] w-[70vw] sm:p-8 md:p-12 max-w-md lg:max-w-lg bg-gradient-to-r from-black/80 to-black/50 text-white rounded-3xl shadow-2xl border border-gray-300 backdrop-blur-lg">
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <p className="text-sm mb-4">Welcome back!</p>

            {/* ALERT MASSAGE MERAH */}
            {alertMessage && (
              <div className="flex items-center bg-red-500 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-md space-x-3 mb-4">
                <FaTimes className="text-xl" />
                <span>{alertMessage}</span>
              </div>
            )}

            {/* FORM LOGIN RUBAH KE FORMIK*/}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Username / Email</label>
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

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-2 text-gray-400">Or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="flex sm:flex-row justify-between gap-4">
              <button className="w-full bg-transparent py-2 rounded-full flex items-center justify-end">
                <FcGoogle className="text-5xl" />{" "}
              </button>
              <button className="w-full bg-transparent py-2 rounded-full flex items-center justify-start">
                <FaFacebook className="text-5xl text-blue-600" />{" "}
              </button>
            </div>

            <div className="text-center text-sm mt-4">
              Don't have an account ?{" "}
              <a href="/register" className="text-indigo-400 ml-1">
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

        {/* FLEX KANAN */}
        <div className="flex items-center justify-center lg:justify-start w-full lg:w-1/2 mt-8 lg:mt-0 px-4 lg:px-0">
          <div className="text-white text-center lg:text-left max-w-lg">
            <h2 className="text-5xl font-bold mb-4 md:mt-[10rem] ">
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
