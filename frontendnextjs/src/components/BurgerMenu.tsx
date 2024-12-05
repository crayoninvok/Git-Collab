"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTimes, FaUser } from "react-icons/fa";

export default function BurgerMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      {/* Burger Menu Button */}

      <button
        onClick={toggleMenu}
        className="text-2xl text-white hover:text-orange-400 focus:outline-none"
      >
        {isMenuOpen ? <FaTimes /> : <FaUser />}
      </button>

      {/* Side Panel Menu */}
      <div
        className={`fixed top-0 right-0 w-80 h-[50vh] rounded-bl-2xl bg-sky-900 backdrop-blur-3xl text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-2xl hover:text-orange-400 focus:outline-none"
        >
          <FaTimes />
        </button>

        {/* Menu Links */}
        <nav className="mt-16 p-6 flex flex-col gap-6">
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg hover:text-orange-400"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg hover:text-orange-400"
          >
            Register
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg hover:text-orange-400"
          >
            Promotor Mode(swtich nya nanti pas sudah login sementara disini)
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg hover:text-orange-400"
          >
            About Us
          </Link>
        </nav>
      </div>

      {/* Background Overlay */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        ></div>
      )}
    </>
  );
}
