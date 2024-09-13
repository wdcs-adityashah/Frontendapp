"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
    const [session, setSession] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedAuthData = sessionStorage.getItem("authData");

        if (storedAuthData) {
            try {
                const { token, session: userSession } = JSON.parse(storedAuthData);
                setSession(userSession);

                if (router.pathname !== "/dashboard") {
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Error parsing session data:", error);
                sessionStorage.removeItem("authData");
                router.push("/login");
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4010/api/logout');

            sessionStorage.removeItem("authData");
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl font-bold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-6">
            <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-md">
                <h1 className="text-3xl font-semibold text-blue-600 mb-4">Dashboard</h1>
                <p className="text-lg mb-6">
                    Welcome, <span className="font-bold">{session?.user?.name || session?.user?.email}</span>!
                </p>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
