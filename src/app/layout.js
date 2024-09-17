"use client"
import './globals.css'
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children, session }) {
  console.log('Session:', session); // Add this line
  return (
    <html lang="en">
      <body>       
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
