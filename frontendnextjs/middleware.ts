import { NextRequest, NextResponse } from "next/server";
import {jwtDecode} from "jwt-decode"

const protectAfterAuth = ["/register", "/login"]
const protectPromotor = ["/dasboard",]

export default function Middleware(request: NextRequest){
    const token = request.cookies.get("token")
    const url = request.nextUrl.pathname

    if(protectAfterAuth.some((route) => url.startsWith(route))&&token){
        return NextResponse.redirect(new URL("/", request.url))
    }
}