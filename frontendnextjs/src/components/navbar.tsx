{
  /* NAVBAR BLM RESPONSIVE */
}

("use client");

import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800/60 backdrop-blur-md text-white py-4 px-8 flex justify-between items-center shadow-md">
      {/* LOGO  */}
      <Link href="/">
        <h1
          className={`${comfortaa.className} text-[30px] tracking-[0.2em] font-bold text-orange-400`}
        >
          TI<span className="text-orange-500">KO</span>
        </h1>
      </Link>

      {/* NAVLINK BLM RESPONSIVE */}
      <ul className="flex gap-8 text-sm">
        <li>
          <Link className="hover:text-orange-400 cursor-pointer" href="/">
            Homepage
          </Link>
        </li>
        <li>
          <Link className="hover:text-orange-400 cursor-pointer" href="/event">
            Event
          </Link>
        </li>
        <li>
          <Link className="hover:text-orange-400 cursor-pointer" href="/artist">
            Artist
          </Link>
        </li>
        <li>
          <Link className="hover:text-orange-400 cursor-pointer" href="/news">
            News
          </Link>
        </li>
      </ul>

      {/* Burger Menu */}
      <BurgerMenu />
    </nav>
  );
}
