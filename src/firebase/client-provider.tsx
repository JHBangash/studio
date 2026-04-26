'use client';

import { useState, useEffect } from 'react';
import { getFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { Loader2, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const services = getFirebase();
      if (services) {
        setFirebase(services);
      } else {
        // This case might be hit if getFirebase is changed to return null
        setError('Failed to initialize Firebase. Configuration is missing or incomplete.');
      }
    } catch (e: any) {
      console.error("Firebase Initialization Error:", e);
      setError(e.message);
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-muted/40">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Firebase Connection Failed</AlertTitle>
          <AlertDescription>
            The application could not connect to Firebase services. This is usually due to missing or incorrect configuration.
            <p className="mt-4 text-sm font-mono bg-red-900/20 p-2 rounded-md">
              <b>Error:</b> {error}
            </p>
            <p className="mt-3 text-xs">
              Please ensure your <code>.env</code> file is correctly set up with your Firebase project credentials.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!firebase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <FirebaseProvider app={firebase.app} auth={firebase.auth} firestore={firebase.firestore}>
      {children}
    </FirebaseProvider>
  );
}
