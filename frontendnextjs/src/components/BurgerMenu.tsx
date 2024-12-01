"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTimes, FaUser } from "react-icons/fa";

export default function BurgerMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState); // Toggle the menu state
  };

  return (
    <div className="relative">
      {/* Burger Menu Button */}
      <button
        onClick={toggleMenu}
        className="text-lg text-white hover:text-orange-400 focus:outline-none"
      >
        {isMenuOpen ? <FaTimes /> : <FaUser />} {/* Change icon based on state */}
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 bg-gray-800 text-white rounded-md shadow-md py-2 px-4 flex flex-col gap-4">
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)} // Close menu on click
            className="hover:text-orange-400"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMenuOpen(false)} // Close menu on click
            className="hover:text-orange-400"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
