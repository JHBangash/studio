// src/firebase/errors.ts
import { getAuth } from 'firebase/auth';
import { getFirebase } from '@/firebase';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;
  public details: Record<string, any>;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore permission denied for ${context.operation} on ${context.path}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    this.details = {};
  }

  private async buildDetails() {
    const { auth } = getFirebase();
    const currentUser = auth.currentUser;

    this.details = {
      message: this.message,
      context: {
        ...this.context,
        requestTime: new Date().toISOString(),
      },
      auth: currentUser
        ? {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            emailVerified: currentUser.emailVerified,
            // In a real app, custom claims would be retrieved from the ID token.
            // This is a client-side approximation.
            token: {
                name: currentUser.displayName,
                picture: currentUser.photoURL,
                email: currentUser.email,
                email_verified: currentUser.emailVerified,
            }
          }
        : null,
    };
  }
  
  public toDetailedString(): string {
    return `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(this.details, null, 2)}`;
  }

  public async toJSON() {
    await this.buildDetails();
    return this.details;
  }
}
