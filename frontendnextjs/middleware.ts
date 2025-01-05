import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const protectAfterAuth = ["/register", "/login"];
const protectPromotor = ["/dashboard"];

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const url = request.nextUrl.pathname;

  if (protectAfterAuth.some((route) => url.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && url.startsWith("/payment")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectAfterAuth, ...protectPromotor, "/payment/:path*"],
};
