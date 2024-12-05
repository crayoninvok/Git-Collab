"use client"; // Mark this as a client component

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname(); // Get the current pathname

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      {/* Logo */}
      <Link href="/">
        <div className="cursor-pointer p-4 flex justify-center">
          <Image src="/tiko.png" alt="Logo" width={110} height={40} />
        </div>
      </Link>

      {/* Sidebar Header */}
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Dashboard Menu
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard">
              <span
                className={`block px-4 py-2 rounded ${
                  pathname === "/dashboard" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                Overview
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/users">
              <span
                className={`block px-4 py-2 rounded ${
                  pathname === "/dashboard/users" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                Users
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings">
              <span
                className={`block px-4 py-2 rounded ${
                  pathname === "/dashboard/settings" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                Settings
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
