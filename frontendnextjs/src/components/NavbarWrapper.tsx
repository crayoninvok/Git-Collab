"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Untuk misahin navbar customer dan promotor
  const noNavbarRoutes = ["/dashboard","/dashboard/create", "/coba", "/tabel"];

  return noNavbarRoutes.includes(pathname) ? null : <Navbar />;
}
