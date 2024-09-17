"use client"
import './globals.css'
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body>       
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
