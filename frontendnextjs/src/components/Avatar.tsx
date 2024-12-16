"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/context/useSession";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Avatar() {
  const { isAuth, user, logout } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown menu
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout with toast
  const handleLogout = async () => {
    toast.success("You have been logged out successfully.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    logout();

    setTimeout(() => {
      router.push("/login/loginuser");
    }, 2000); 
  };

  // Render nothing if not authenticated
  if (!isAuth || !user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <ToastContainer />

      {/* Avatar and User Info */}
      <div className="flex space-x-3 items-center">
        <button onClick={toggleDropdown} className="focus:outline-none">
          <img
            src={user.avatar || "/default-user-avatar.png"}
            alt="User Avatar"
            className="w-14 h-14 rounded-full border-2 border-green-300"
          />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold">{user.username || "User"}</h1>
          <h1 className="text-sm">{user.email}</h1>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black/50 border border-gray-800 rounded-lg shadow-lg backdrop-blur-md z-50">
          <ul className="py-2">
            <li>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push("/profile");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-sky-200 hover:text-orange-300"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push("/");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-sky-200 hover:text-orange-300"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push("/event");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-sky-200 hover:text-orange-300"
              >
                Event
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push("/artist");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-sky-200 hover:text-orange-300"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
