// src/hooks/use-auth-guard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import type { UserProfile } from '@/firebase/auth/auth';

export const useAuthGuard = (allowedRoles?: UserProfile['role'][]) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until user status is determined
    }

    if (!user) {
      // Not logged in, redirect to login
      router.push('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Role not allowed, redirect to a default page
      // (customers go to portal, others to dashboard)
      if (user.role === 'Customer') {
        router.push('/portal');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, allowedRoles]);

  return { user, loading };
};
