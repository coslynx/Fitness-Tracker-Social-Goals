"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store'; 
import { Button } from '@/components/common/Button';
import Link from 'next/link'; 
import { clsx } from 'clsx';

// Tailwind CSS classes for styling
import styles from './Header.module.css'; 

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, setUser } = useStore(); 

  const handleLogout = async () => {
    try {
      await session?.user?.id && setUser(null);
      const response = await fetch('/api/auth/logout');
      if (response.ok) {
        router.push('/'); // Redirect to the home page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={clsx(styles.header, 'bg-white shadow-md')}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/images/logo.png" alt="Fitness Tracker Logo" className="w-16 h-16" />
          <span className="ml-4 text-2xl font-bold text-brand-primary">Fitness Tracker</span>
        </Link>
        <nav className="flex items-center">
          {session && (
            <>
              <Link href="/dashboard" className="mr-6 text-gray-700 hover:text-brand-primary">
                Dashboard
              </Link>
              <Link href="/goals" className="mr-6 text-gray-700 hover:text-brand-primary">
                Goals
              </Link>
              <Link href="/profile" className="mr-6 text-gray-700 hover:text-brand-primary">
                Profile
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          {!session && (
            <Link href="/auth/login" className="text-gray-700 hover:text-brand-primary">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;