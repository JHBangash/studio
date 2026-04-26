// src/firebase/auth/auth.ts
'use client';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
  updatePassword as firebaseUpdatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import { getFirebase } from '@/firebase';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee' | 'Customer';
  avatar?: string;
}

// Sign up
export const signUp = async (
  email: string,
  password: string,
  name: string,
  role: UserProfile['role']
): Promise<User> => {
  const { auth, firestore } = getFirebase();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });
  
  const userProfile: UserProfile = {
    name,
    email: user.email!,
    role,
    avatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
  };

  const userDocRef = doc(firestore, 'users', user.uid);
  setDoc(userDocRef, userProfile).catch((serverError) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: userDocRef.path,
      operation: 'create',
      requestResourceData: userProfile,
    }));
  });

  return user;
};

// Sign in
export const signIn = async (email: string, password: string): Promise<User> => {
  const { auth } = getFirebase();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  const { auth } = getFirebase();
  await signOut(auth);
};

// Listen for auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  const { auth } = getFirebase();
  return onAuthStateChanged(auth, callback);
};

// Add a user profile (for admins creating users)
export const addUserProfile = async (db: Firestore, profile: Omit<UserProfile, 'uid' | 'avatar'>) => {
    // Note: This only creates the profile in Firestore.
    // The user needs to sign up to create an actual auth account.
    // In a real app, you might use a cloud function to send an invite.
    const fakeUid = doc(collection(db, 'users')).id; // temp ID for display
    const userProfile: UserProfile = {
        ...profile,
        avatar: `https://picsum.photos/seed/${fakeUid}/100/100`,
    };
    // In a real app, you would not create a document like this.
    // Instead you'd have a 'userInvites' collection, and a cloud function
    // would handle the rest. For this demo, we'll add it to users.
    // We cannot create an Auth user from the client-side for another person.
    const userDocRef = doc(db, 'users', profile.email); // Use email as ID for invited users
    await setDoc(userDocRef, userProfile);
};

// Update user profile
export const updateUserProfile = async (db: Firestore, uid: string, data: Partial<UserProfile>) => {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, data);
};

// Update user password
export const updateUserPassword = async (newPassword: string) => {
    const { auth } = getFirebase();
    const user = auth.currentUser;
    if (user) {
        await firebaseUpdatePassword(user, newPassword);
    } else {
        throw new Error("No authenticated user found.");
    }
}

// Delete user
export const deleteUserFromSystem = async (db: Firestore, uid: string) => {
    // This is a simplified version. A real-world scenario would require a Cloud Function
    // to delete the Firebase Auth user, as this is a privileged operation.
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
};
