'use client';

import { getFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';

const { app, auth, firestore } = getFirebase();

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
