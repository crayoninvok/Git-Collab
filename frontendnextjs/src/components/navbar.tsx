"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import { Comfortaa } from "next/font/google";
import Image from "next/image";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior
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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-800/60 backdrop-blur-md text-white py-4 px-8 flex justify-between items-center shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* LOGO */}
      <Link href="/">
        <Image
          src="/tiko.png" 
          alt="Logo"
          width={110} 
          height={40} 
        />
      </Link>

      {/* NAVLINKS */}
      <ul className="flex gap-8 text-xl">
        {["Homepage", "Event", "Artist", "News"].map((link) => (
          <li key={link}>
            <Link
              href={`/${link.toLowerCase()}`}
              className="relative group cursor-pointer"
            >
              <span className="transition-all duration-500 ease-in-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-[length:0%_100%] bg-left-bottom group-hover:bg-[length:100%_100%] group-hover:underline-[length:100%_100%] group-hover:text-black text-white">
                {link}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Burger Menu */}
      <BurgerMenu />
    </nav>
  );
}
