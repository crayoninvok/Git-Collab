"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { IoMdCloseCircleOutline } from "react-icons/io";


export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${
        isOpen ? "w-80 md:w-80 h-full" : "w-90 h-full"
      } transition-all duration-300`}
    >
      <div
        className={` text-white min-h-screen p-4 transition-all ${
          isOpen ? "block" : "hidden md:block"
        }`}
      >
        <Link href="/">
          <div className="cursor-pointer p-4 flex justify-center">
            <Image src="/tiko.png" alt="Logo" width={150} height={50} />
          </div>
        </Link>

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
              <Link href="/">
                <span
                  className={`block px-4 py-2 rounded ${
                    pathname === "/" ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  Logout
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-4 left-4 bg-gray-800 text-white p-2 rounded"
      >
        {isOpen ? <IoMdCloseCircleOutline /> : <CiMenuKebab className="text-2xl" />}
      </button>
    </div>
  );
}
