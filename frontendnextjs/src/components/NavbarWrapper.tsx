"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Untuk misahin navbar customer dan promotor
  const noNavbarRoutes = ["/dashboard","/dashboard/create", "/coba", "/tabel","/dashboard/profileadmin", "/dahsboard/events", "dahsboard/events/edit/[id]"];

  return noNavbarRoutes.includes(pathname) ? null : <Navbar />;
}