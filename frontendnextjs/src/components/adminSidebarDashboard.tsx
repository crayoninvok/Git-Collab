"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  MdOutlineDashboard,
  MdEvent,
  MdAddCircleOutline,
  MdPersonOutline,
  MdLogout,
} from "react-icons/md";
import { useSession } from "@/context/useSessionHook";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useSession();

  const handleLogout = () => {
    logout();
    router.push("/login/loginpromotor");
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white min-h-screen shadow-2xl transition-transform duration-300 ease-in-out group hover:translate-x-0 ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-56 w-64"
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex justify-center border-b border-gray-700">
          <Link href="/">
            <Image
              src="/tiko.png"
              alt="Logo"
              width={150}
              height={50}
              className="transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Sidebar Menu */}
        <div className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-700">
          Promotor Menu
        </div>

        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard">
                <div
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    pathname === "/dashboard"
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <MdOutlineDashboard className="text-2xl" />
                  <span className="font-medium">Overview</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/events">
                <div
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    pathname === "/dashboard/events"
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <MdEvent className="text-2xl" />
                  <span className="font-medium">My Events</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/create">
                <div
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    pathname === "/dashboard/create"
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <MdAddCircleOutline className="text-2xl" />
                  <span className="font-medium">Create</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/profileadmin">
                <div
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    pathname === "/dashboard/profileadmin"
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <MdPersonOutline className="text-2xl" />
                  <span className="font-medium">Profile</span>
                </div>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 w-full text-left rounded-lg cursor-pointer transition-all hover:bg-red-600 text-gray-300 hover:text-white"
              >
                <MdLogout className="text-2xl" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-transparent text-slate-100 p-2 rounded lg:hidden"
      >
        {isOpen ? (
          <span>Close</span>
        ) : (
          <span>Menu</span>
        )}
      </button>
    </div>
  );
}
