"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/context/useSessionHook";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbMenuDeep } from "react-icons/tb";
import { FaUserCircle, FaSignOutAlt, FaMicroblog } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { RiHomeSmileFill } from "react-icons/ri";
import { SiEventbrite } from "react-icons/si";

export default function Avatar() {
  const { isAuth, user, logout } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [,setIsLoggingOut] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
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
      window.location.assign("/login/");
    }, 1000);
  };

  const navigateTo = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  if (!isAuth || !user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <ToastContainer />

      {/* Avatar Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-between h-[50px] px-3 py-1 bg-gray-700/40 rounded-full shadow-md hover:shadow-glow transition duration-500 focus:outline-none border border-yellow-500"
        aria-expanded={isMenuOpen}
        aria-controls="menu"
      >
        <span className="text-white font-semibold">
          {user.username?.slice(0, 3).toUpperCase() || "username"}
        </span>
        <div className="ml-2 w-8 h-8 flex justify-center items-center bg-gray-700 rounded-full">
          <TbMenuDeep className="w-8" />
        </div>
      </button>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 w-[350px] h-screen bg-gray-800/80 text-white rounded-l-2xl shadow-lg transform transition-all duration-500 ease-in-out z-50 ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-400 bg-gray-900">
          <img src="/nrvnkurt.png" alt="Menu Logo" className="h-10 w-auto" />
          Navigtion Menu
          <button
            onClick={toggleMenu}
            className="text-gray-400 hover:text-gray-200 transition duration-200"
          >
            ✕
          </button>
        </div>

        {/* Menu Content */}
        <div className="px-6 py-6 space-y-6 h-full">
          {/* Welcome Section */}
          <div>
            <h1 className="text-[22px] font-semibold text-gray-300">
              Hello{" "}
              <span className="text-yellow-500">
                {user.username.toLocaleUpperCase()}{" "}
              </span>
              🌟,
            </h1>
          </div>

          {/* Avatar */}
          <div className="flex justify-center items-center">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="avatar"
              className="rounded-full w-32 h-32 border-4 border-orange-500 shadow-lg"
            />
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            {/* Profile */}
            <MenuItem
              icon={<FaUserCircle className="text-white text-xl" />}
              label="Profile"
              onClick={() => navigateTo("/profile")}
            />

            {/* Homepage */}
            <MenuItem
              icon={<RiHomeSmileFill className="text-white text-xl" />}
              label="Homepage"
              onClick={() => navigateTo("/")}
            />

            {/* Event */}
            <MenuItem
              icon={<SiEventbrite className="text-white text-xl" />}
              label="Events"
              onClick={() => navigateTo("/events")}
            />

            {/* Artist */}
            <MenuItem
              icon={<FaMicroblog className="text-white text-xl" />}
              label="Artist"
              onClick={() => navigateTo("/artist")}
            />

            {/* Logout */}
            <MenuItem
              icon={<FaSignOutAlt className="text-red-500 text-xl" />}
              label="Logout"
              onClick={handleLogout}
              highlight
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}

const MenuItem = ({ icon, label, onClick, highlight }: MenuItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 cursor-pointer ${
      highlight
        ? "bg-red-500 hover:bg-red-600"
        : "bg-gray-900 hover:bg-gray-700"
    }`}
  >
    <div className="flex items-center space-x-4">
      {icon}
      <span className="text-white text-sm font-semibold">{label}</span>
    </div>
    <FiChevronRight className="text-gray-400 text-lg" />
  </div>
);
