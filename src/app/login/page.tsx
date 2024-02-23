'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import InputField from '../ui/signup/input';
import { toast, Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
    username: '',
  });

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const loadingToast = toast.loading('Logging in...');
    try {
      const response = await axios.post('api/users/login', user);
      toast.dismiss(loadingToast);
      if (response.status === 200) {
        const data = response.data;
        toast.success(data.message || 'Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.error || 'An error occurred. Please try again.';
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleOnChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      email: event.target.value,
    });
  };

  const handleOnChangePassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUser({
      ...user,
      password: event.target.value,
    });
  };

  return (
    <main className=" flex h-screen flex-col items-center justify-center">
      <Toaster />
      <h1 className="mb-10 p-4 text-2xl">Login Page</h1>
      <form
        className="flex flex-col items-center justify-center gap-6"
        onSubmit={onLogin}
      >
        <div></div>
        <label className="flex flex-col" htmlFor="email">
          Email:
          <InputField
            id="email"
            type="email"
            min={1}
            value={user.email}
            placeholder="Your email"
            onChange={handleOnChangeEmail}
            required={true}
          />
        </label>
        <label className="flex flex-col" htmlFor="password">
          Password:
          <InputField
            id="password"
            type="password"
            min={1}
            value={user.password}
            placeholder="Your password"
            onChange={handleOnChangePassword}
            required={true}
          />
        </label>
        <button
          className="flex h-9 w-20 items-center justify-center rounded-md border border-white bg-black p-4 text-sm text-white hover:bg-white hover:text-black active:translate-y-1"
          type="submit"
        >
          Login
        </button>
      </form>
      <Link className="mt-5 rounded-md p-1 text-xs underline" href="/signup">
        New user? Sign up here
      </Link>
    </main>
  );
}
