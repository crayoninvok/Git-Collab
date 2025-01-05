"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BurgerHandphone from "./BurgerMenuHP";
import BurgerMenu from "./BurgerMenu";
import Avatar from "./Avatar";
import { useSession } from "@/context/useSessionHook";

export default function Navbar() {
  const { isAuth } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    window.requestAnimationFrame(() => {
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 100);
      setLastScrollY(currentScrollY);
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = isAuth 
    ? [
        { href: "/", label: "Homepage" },
        { href: "/event", label: "Event" },
        { href: "/artist", label: "Artist" },
        { href: "/news", label: "News" },
      ]
    : [
        { href: "/", label: "Homepage" },
        { href: "/event", label: "Event" },
      ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-800/30 backdrop-blur-md text-white py-4 px-4 md:px-8 flex justify-between items-center shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* LOGO with hover effect */}
      <Link href="/">
        <div className="cursor-pointer w-[15vw] min-w-[90px] transform transition-transform duration-300 hover:scale-105">
          <Image src="/tiko.png" alt="Logo" width={110} height={40} priority />
        </div>
      </Link>

      {/* Mobile Menu */}
      <div className="lg:hidden flex items-center">
        {isAuth ? <Avatar /> : <BurgerHandphone />}
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex gap-8 text-xl">
        {isAuth ? (
          <Avatar />
        ) : (
          <>
            {navLinks.map((link) => (
              <Link href={link.href} key={link.label}>
                <div className="relative group cursor-pointer">
                  <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-orange-400">
                    {link.label}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 w-0 bg-orange-400 group-hover:w-full transition-all duration-300 ease-out"></div>
                </div>
              </Link>
            ))}
            <div className="pl-4 ml-4 border-l border-white/10">
              <BurgerMenu />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
