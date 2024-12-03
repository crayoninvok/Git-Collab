"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import Image from "next/image";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll Ilang
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-800/60 backdrop-blur-md text-white py-4 px-8 flex justify-between items-center shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* LOGO */}
      <Link href="/">
        <span className="cursor-pointer">
          <Image src="/tiko.png" alt="Logo" width={110} height={40} priority />
        </span>
      </Link>

      {/* NAVLINKS */}
      <ul className="flex gap-8 text-xl">
        <li>
          <Link href="/">
            <span className="cursor-pointer transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom hover:bg-[length:100%_100%]  hover:text-black text-white">
              Homepage
            </span>
          </Link>
        </li>
        <li>
          <Link href="/event">
            <span className="cursor-pointer transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom hover:bg-[length:100%_100%]  hover:text-black text-white">
              Event
            </span>
          </Link>
        </li>
        <li>
          <Link href="/artist">
            <span className="cursor-pointer transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom hover:bg-[length:100%_100%]  hover:text-black text-white">
              Artist
            </span>
          </Link>
        </li>
        <li>
          <Link href="/news">
            <span className="cursor-pointer transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom hover:bg-[length:100%_100%]  hover:text-black text-white">
              News
            </span>
          </Link>
        </li>
      </ul>

      {/* Burger Menu */}
      <BurgerMenu />
    </nav>
  );
}
