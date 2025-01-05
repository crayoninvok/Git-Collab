"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Untuk misahin navbar customer dan promotor
<<<<<<< HEAD
  const noNavbarRoutes = ["/dashboard","/dashboard/create","/tabel","/dashboard/profileadmin","/coba"];
=======
  const noNavbarRoutes = ["/dashboard","/dashboard/create", "/coba", "/tabel","/dashboard/profileadmin", "/dahsboard/events", "dahsboard/events/edit/[id]"];
>>>>>>> e1fddd8f90f19c6e0630e2f0849cb2353045562c

  return noNavbarRoutes.includes(pathname) ? null : <Navbar />;
}