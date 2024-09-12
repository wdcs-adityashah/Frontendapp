"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedSession = sessionStorage.getItem("userSession");

    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
      } catch (error) {
        console.error("Error parsing session data:", error);
        sessionStorage.removeItem("userSession");
        router.push("/pages/login");
      }
    } else {
      // If no session found, redirect to login
      router.push("/pages/login");
    }
  }, [router]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return <p>Welcome, {session?.user?.name || session?.user?.email}!</p>;
}
