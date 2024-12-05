"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BurgerHandphone from "./BurgerMenuHP";
import Image from "next/image";
import { BiSearchAlt } from "react-icons/bi";
import BurgerMenu from "./BurgerMenu";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Handle scroll hiding
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen((prevState) => !prevState);
  };

  const closeModal = () => {
    setIsSearchModalOpen(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-800/60 backdrop-blur-md text-white py-4 px-4 md:px-8 flex justify-between items-center shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* LOGO */}
      <Link href="/">
        <div className="cursor-pointer w-[15vw] min-w-[90px]">
          <Image src="/tiko.png" alt="Logo" width={110} height={40} priority />
        </div>
      </Link>

      {/* Search Bar for Desktop */}
      <div className="hidden md:block relative w-[35vw] min-w-[200px] mx-auto">
        <input
          type="text"
          placeholder="Type to search..."
          className="w-full px-6 py-3 text-white bg-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f9a205] shadow-md"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#f9a205] text-white px-4 py-2 rounded-full hover:bg-[#e09104] shadow-lg transition duration-300 ease-in-out">
          <BiSearchAlt />
        </button>
      </div>

      {/* Mobile Search and Menu */}
      <div className="lg:hidden flex items-center gap-4">
        {/* Mobile Search Icon */}
        <button
          onClick={toggleSearchModal}
          className="text-2xl text-white hover:text-orange-400"
        >
          <FaSearch />
        </button>

        {/* Mobile Menu */}
        <BurgerHandphone />
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex gap-8 text-xl">
        <div>
          <Link href="/">
            <div className="cursor-pointer transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom hover:bg-[length:100%_100%] hover:text-black text-white">
              Homepage
            </div>
          </Link>
        </div>
        <div>
          <Link href="/event">
            <div className="cursor-pointer transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom hover:bg-[length:100%_100%] hover:text-black text-white">
              Event
            </div>
          </Link>
        </div>
        <div>
          <Link href="/artist">
            <div className="cursor-pointer transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom hover:bg-[length:100%_100%] hover:text-black text-white">
              Artist
            </div>
          </Link>
        </div>
        <div>
          <Link href="/news">
            <div className="cursor-pointer transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom hover:bg-[length:100%_100%] hover:text-black text-white">
              News
            </div>
          </Link>
        </div>
        <BurgerMenu />
      </div>

      {/* Mobile Search Modal */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center h-[30vh]"
          onClick={closeModal} 
        >
          <div
            className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Search</h2>
              <button
                onClick={closeModal}
                className="text-2xl hover:text-orange-400"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full px-4 py-2 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-[#f9a205]"
              />
              <button className="w-full mt-4 bg-[#f9a205] text-white px-4 py-2 rounded-md hover:bg-[#e09104] transition duration-300">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
