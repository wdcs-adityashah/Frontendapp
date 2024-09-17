"use client";

import { useState, useEffect } from 'react';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyTokenAndFetchData = async () => {
    const authData = sessionStorage.getItem('authData');
    console.log('Auth Data:', authData); 

    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        console.log('Token:', token);

        if (token) {
          const response = await fetch('http://192.168.109.149:4010/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('User Data:', userData); // Debugging
            setUsers(userData);
            setLoading(false);
          } else {
            const errorText = await response.text();
            console.error('Response Error:', errorText); // Debugging
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
    verifyTokenAndFetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <div className="text-lg font-medium text-gray-800">Name:{user.name}</div>
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
