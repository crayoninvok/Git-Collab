"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { deleteCookie } from "@/libs/action"; // Assuming you have this function

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Logout Function
  const handleLogout = () => {
    deleteCookie("token"); // Clear token
    router.push("/login/loginpromotor"); // Redirect to login page
    router.refresh(); // Refresh state (optional)
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-80" : "w-20"
        } bg-gray-900 text-white min-h-screen transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-4 flex justify-center">
          <Link href="/">
            <Image
              src="/tiko.png"
              alt="Logo"
              width={isOpen ? 150 : 50}
              height={50}
              className="transition-all"
            />
          </Link>
        </div>

        {/* Sidebar Menu */}
        {isOpen && (
          <div className="p-4 text-lg font-bold border-b border-gray-700">
            Admin Menu
          </div>
        )}

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <span
                  className={`block px-4 py-2 rounded ${
                    pathname === "/dashboard"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  Overview
                </span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/create">
                <span
                  className={`block px-4 py-2 rounded ${
                    pathname === "/dashboard/create"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  Create
                </span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/profileadmin">
                <span
                  className={`block px-4 py-2 rounded ${
                    pathname === "/dashboard/profileadmin"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  Profile
                </span>
              </Link>
            </li>
            <li>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-4 left-4 bg-gray-800 text-white p-2 rounded"
      >
        {isOpen ? (
          <IoMdCloseCircleOutline className="text-2xl" />
        ) : (
          <CiMenuKebab className="text-2xl" />
        )}
      </button>
    </div>
  );
}
