'use client';

import { useSearchParams, redirect } from 'next/navigation';
import { useEffect } from 'react';

export function DashboardRedirect() {
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';

  useEffect(() => {
    window.location.href = `/student${search}`;
  }, [search]);

  return null;
}
