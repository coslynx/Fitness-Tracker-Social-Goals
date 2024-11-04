"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { useStore } from '@/store'; // Assuming you have a store for global state
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { apiClient } from '@/lib/api/client';
import { getFormattedDate } from '@/lib/utils/formatters';

interface UserProfile {
  id: number;
  email: string;
  name: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useStore(); // Access the current user from the store
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();
        if (session) {
          const response = await apiClient.get('/profile');
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setUpdateError('');
    try {
      const response = await apiClient.put('/profile', {
        name: updatedName,
        password: updatedPassword,
      });
      setUserProfile(response.data);
      setUpdatedName('');
      setUpdatedPassword('');
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError(error.message);
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Header user={user} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold mb-10">Your Profile</h1>
        {isLoading ? (
          <p>Loading profile...</p>
        ) : userProfile ? (
          <div className="max-w-md rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email:
              </label>
              <span className="text-gray-600">{userProfile.email}</span>
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Name:
              </label>
              <Input
                id="name"
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                Password:
              </label>
              <Input
                id="password"
                type="password"
                value={updatedPassword}
                onChange={(e) => setUpdatedPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            {updateError && <p className="text-red-500">{updateError}</p>}
            <Button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        ) : (
          <p>No user profile found.</p>
        )}
      </main>
      <Footer />
    </>
  );
}