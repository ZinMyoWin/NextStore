"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserDeleteConfirmationAlert } from "../ui/components/AlertDialog";


interface User {
  _id: string;
  name: string;
  email: string;
  role: string

}
export default function ManageUserPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users only if the user is an admin
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [status, session]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      console.log("Users: ", users);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(id: string) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      toast.success("User successfully deleted.");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  }

  // Loading state while session is being fetched
  if (status === "loading") {
    return <div className='text-center p-6 text-gray-600'>Loading...</div>;
  }

  // Unauthorized state: if unauthenticated or role is not 'admin' (e.g., 'user')
  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full'>
          <h1 className='text-3xl font-bold text-red-600 mb-4'>
            Unauthorized Access
          </h1>
          <p className='text-gray-700 mb-6'>
            You do not have permission to view this page. Only administrators
            can access this section.
          </p>
          <a href='/' className='text-blue-600 hover:underline font-medium'>
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Admin view: User management interface
  return (
    <div className='min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>User Management</h1>
          <p className='mt-2 text-sm text-gray-600'>
            Manage your e-commerce platform users
          </p>
        </div>

        {/* Users Table */}
        <div className='bg-white shadow-md rounded-lg overflow-hidden'>
          {loading ? (
            <div className='p-6 text-center'>
              <p className='text-gray-600'>Loading users...</p>
            </div>
          ) : error ? (
            <div className='p-6 text-center'>
              <p className='text-red-600'>{error}</p>
              <button
                onClick={fetchUsers}
                className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Retry
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className='p-6 text-center'>
              <p className='text-gray-600'>No users found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Role
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map((user) => (
                    <tr key={user._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {user._id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {user.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {user.email}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <button className='text-indigo-600 hover:text-indigo-900 mr-4'>
                          Edit
                        </button>
                       <UserDeleteConfirmationAlert onConfirm={()=> handleDeleteUser(user._id)}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        {!loading && (
          <div className='mt-6 flex justify-end'>
            <button
              onClick={fetchUsers}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
