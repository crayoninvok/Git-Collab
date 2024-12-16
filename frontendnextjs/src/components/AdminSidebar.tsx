"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { deleteCookie } from "@/libs/action";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    deleteCookie("token");
    window.location.assign("/login/loginpromotor");
    router.refresh();
  };

  return (
    <div className="relative w-0">
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 bg-gray-900 text-white min-h-screen transition-transform duration-300 ${
          isOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"
        }`}
      >
        {/* Logo */}
        <div className="p-4 flex justify-center">
          <Link href="/">
            <Image
              src="/tiko.png"
              alt="Logo"
              width={150}
              height={50}
              className="transition-all"
            />
          </Link>
        </div>

        {/* Sidebar Menu */}
        <div className="p-4 text-lg font-bold border-b border-gray-700">
          Admin Menu
        </div>

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
        className="relative top-4 left-4 z-50 bg-transparent text-orange-500 p-2 rounded"
      >
        {isOpen ? (
          <IoMdCloseCircleOutline className="text-3xl" />
        ) : (
          <CiMenuKebab className="text-3xl mt-5 font-bold " />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar} // Close sidebar when overlay is clicked
        ></div>
      )}
    </div>
  );
}
