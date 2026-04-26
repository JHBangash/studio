'use client';

import { useState, useEffect } from 'react';
import { getFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { Loader2, AlertTriangle } from 'lucide-react';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // getFirebase() will only be called on the client
    const services = getFirebase();
    if (services) {
      setFirebase(services);
    }
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    // Initial check in progress, show a loader.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!firebase) {
    // Initialization attempted, but config was missing.
    // Display a clear error message to the user.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-muted/40">
        <div className="p-8 bg-card border rounded-lg shadow-sm max-w-md">
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground mt-4">Configuration Error</h1>
          <p className="text-muted-foreground mt-2">
            The application is not configured to connect to Firebase.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please ensure your Firebase environment variables are correctly set up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider app={firebase.app} auth={firebase.auth} firestore={firebase.firestore}>
      {children}
    </FirebaseProvider>
  );
}
