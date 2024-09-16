import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from 'jose';

const SECRET_KEY = 'your_secret_key'; // Use the same secret key as in the backend

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
      console.error("Invalid token:", token);
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  
    const secretKeyBuffer = Buffer.from(SECRET_KEY, 'utf8');
    console.log("Verifying token with secret key:", SECRET_KEY);
    const user = await jwtVerify(tokenValue, secretKeyBuffer);
    console.log("Token verified successfully:", user);
    const { role } = user.payload;
    console.log(role);
    if(pathname === '/login' && token){
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    if (pathname === '/' && token) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    if (role === 'admin') {
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/user", req.nextUrl));
      }
    } else {
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
      }
    }

    // Protect routes based on the user's role

    if (role === 'admin' && pathname.startsWith("/user")) {
      return NextResponse.next(); // Allow access to /user routes for admin
    } else if (role !== 'admin' && pathname.startsWith("/dashboard")) {
      return NextResponse.next(); // Allow access to /dashboard routes for non-admin
    } else if (pathname === "/user" && role !== 'admin') {
      return NextResponse.redirect(new URL("/not-found", req.nextUrl));
    } 
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

}

export const config = {
  matcher: ["/login", "/dashboard", "/", "/user"],
};