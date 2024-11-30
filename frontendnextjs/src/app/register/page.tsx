"use client";

import { useState } from "react";


enum UserRole {
  Customer = "Customer",
  Promoter = "Promoter",
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.Customer); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all the fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert(`Registration successful as a ${role}! Redirecting...`);
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

        <div className="flex items-start justify-start w-full md:w-1/2 ">
          <div className="text-white text-start max-w-lg">
            <h2 className="text-4xl font-bold mb-4">
              Join the Excitement With
              <span className="text-orange-400"> TIKO</span>
            </h2>
            <p className="text-sm">
              Register now and explore amazing events happening near you. Be the
              first to know about exclusive offers and updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
