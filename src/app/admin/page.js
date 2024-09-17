"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params from the URL

  const verifyTokenAndFetchData = async (query = '') => {
    const authData = sessionStorage.getItem('authData');

    if (authData) {
      try {
        const { token } = JSON.parse(authData);

        if (token) {
          const response = await fetch(`http://192.168.109.149:4010/api/admin?search=${query}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUsers(userData);
            setLoading(false);
          } else {
            const errorText = await response.text();
            console.error('Response Error:', errorText);
            setError('Invalid token');
            setLoading(false);
          }
        } else {
          setError('No token found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to verify token');
        setLoading(false);
      }
    } else {
      setError('No authentication data found');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get the search term from the URL if it exists
    const searchQuery = searchParams.get('search') || '';
    setSearchTerm(searchQuery);
    verifyTokenAndFetchData(searchQuery);
  }, [searchParams]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Update the URL with the search term
    router.push(`?search=${value}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">User Details</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />

      {/* Display Users */}
      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <div className="text-lg font-medium text-gray-800">Name: {user.name}</div>
              <div className="text-sm text-gray-600">Email: {user.email}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-lg text-gray-600">No users found</div>
      )}
    </div>
  );
};

export default UserPage;
