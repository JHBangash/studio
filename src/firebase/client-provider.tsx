'use client';

import { useMemo } from 'react';
import { getFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, firestore } = useMemo(() => getFirebase(), []);

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
