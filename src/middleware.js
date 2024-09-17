import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; 

const protectedRoutes = {
  admin: ['/admin', '/manager'], 
  manager: ['/manager'],
};

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookieHeader = cookies(req);
  const token = cookieHeader.get("token");

  if (!token) {
    if (pathname === '/login') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  try {
    const tokenValue = token.value;
    if (!tokenValue || typeof tokenValue !== 'string') {
      console.error("Invalid token format:", token);
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    const secretKeyBuffer = Buffer.from(SECRET_KEY, 'utf8');
    const { payload } = await jwtVerify(tokenValue, secretKeyBuffer);
    const { role } = payload;

    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (pathname === '/') {
      if (role === 'admin') {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      }
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    const allowedRoutes = protectedRoutes[role] || [];
    if (allowedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next(); 
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL("/not-found", req.nextUrl)); // Redirect non-admins away from admin routes
    }
    if (pathname.startsWith('/manager') && role !== 'admin' && role !== 'manager') {
      return NextResponse.redirect(new URL("/not-found", req.nextUrl)); // Redirect non-managers away from manager routes
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.redirect(new URL("/login", req.nextUrl)); 
  }
}

export const config = {
  matcher: ["/login", "/dashboard", "/", "/user", "/admin", "/manager"], 
};
