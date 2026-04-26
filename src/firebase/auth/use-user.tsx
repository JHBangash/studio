'use client';

import { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { onAuthChange } from './auth';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from './auth';

export const useUser = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const db = useFirestore();

  const userDocRef = authUser ? doc(db, 'users', authUser.uid) : null;
  const { data: userProfile, loading: profileLoading } = useDoc(userDocRef);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setAuthUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    user: userProfile as (UserProfile & { uid: string }) | null,
    authUser,
    loading: loading || (authUser && profileLoading),
  };
};
