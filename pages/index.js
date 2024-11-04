import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import apiClient from '../../lib/api/client';
import { getSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUser(session.user);
      }
      setIsLoading(false);
    };

    fetchSession();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>You are not logged in. Please log in to access the application.</p>
        <button onClick={() => router.push('/auth/login')}>Log In</button>
      </main>
    );
  }

  return (
    <>
      <Header user={user} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Welcome to Fitness Tracker, {user.name}!</h1>
        <p>Start your fitness journey today.</p>
        <button onClick={() => router.push('/dashboard')}>Go to Dashboard</button>
      </main>
      <Footer />
    </>
  );
}