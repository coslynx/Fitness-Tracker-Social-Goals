"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { apiClient } from '@/lib/api/client'; 

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!loginData.email || !loginData.password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      const response = await apiClient.post('/api/auth/session', loginData);

      if (response.ok) {
        const session = await getSession();
        if (session) {
          setUser(session.user);
          router.push('/dashboard');
        } else {
          setError('Failed to fetch session data');
        }
        setIsLoading(false);
      } else {
        setError(response.data.message || 'Failed to log in');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}

      <Input
        id="email"
        type="email"
        placeholder="Email"
        value={loginData.email}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2"
      />

      <Input
        id="password"
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary-dark"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;