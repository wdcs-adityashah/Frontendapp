"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]); // Use a more specific type if possible

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user?.role === "admin") {
        // Fetch users data only if the user is authenticated and has the admin role
        const fetchUsers = async () => {
          try {
            const response = await fetch("http://localhost:4010/api/users", {
              headers: {
                Authorization: `Bearer ${session.accessToken}`, // Use the correct token
              },
            });
  
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
  
            const data = await response.json();
            setUsers(data);
          } catch (error) {
            console.error("Error fetching users:", error);
            console.log("Response data:", await response.text());
            router.push("/not-found"); // Redirect to /not-found on error
          }
        };
  
        fetchUsers();
      } else {
        router.push("/not-found"); // Redirect to /not-found if not admin
      }
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-2xl font-bold mb-4">User List (Admin Only)</h1>
      {users.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user._id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}