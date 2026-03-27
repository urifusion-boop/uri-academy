'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_profile');

      // Redirect to login
      router.push('/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [router]);

  return null;
}
