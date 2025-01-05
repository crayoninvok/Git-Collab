"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTimes     } from "react-icons/fa";
import { TbMenuDeep } from "react-icons/tb";

export default function BurgerHandphone() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      {/* Burger Menu Button */}
    
      <button
        onClick={toggleMenu}
        className="text-3xl text-white hover:text-orange-400 focus:outline-none"
      >
        {isMenuOpen ? <FaTimes /> : <TbMenuDeep />}
      </button>

      {/* Side Panel Menu */}
      <div
        className={`fixed top-0 right-0 w-80 h-[70vh] rounded-bl-2xl bg-black/85 backdrop-blur-3xl text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
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
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl hover:text-orange-400"
          >
            Homepage
          </Link>
          <Link
            href="/artist"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl hover:text-orange-400"
          >
            Artist
          </Link>
          <Link
            href="/event"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl hover:text-orange-400"
          >
            Event
          </Link>
          <Link
            href="/news"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl hover:text-orange-400"
          >
            News
          </Link>
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl hover:text-orange-400"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl hover:text-orange-400"
          >
            Register
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl hover:text-orange-400"
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