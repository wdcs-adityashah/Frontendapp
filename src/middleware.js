import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookieHeader = cookies(req);

  const token = cookieHeader.get("token");

  if (pathname === "/login" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  
  if (pathname !== "/login" && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard"],
};
