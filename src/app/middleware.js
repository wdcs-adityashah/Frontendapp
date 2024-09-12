import { NextResponse } from 'next/server';

import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

const protectedRoutes = ['/dashboard'];

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

       if (req.nextUrl.pathname.startsWith('/login') && token) {
        try {
            jwt.verify(token, SECRET_KEY);
            return NextResponse.redirect(new URL('/dashboard', req.url));
        } catch (err) {
            console.log(err);
        }
    }

    if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
        try {
            jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard'],
};
