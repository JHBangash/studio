// src/firebase/firestore/db.ts
'use client';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import type { UserProfile } from '../auth/auth';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type NewDocumentPayload = {
  name: string;
  type: string;
  metadata: Record<string, string>;
};

// This function creates a new document and its initial workflow/audit trail entries
export const addDocument = async (
  db: Firestore,
  user: UserProfile,
  payload: NewDocumentPayload
) => {
  if (!user) throw new Error('User must be authenticated to add a document.');

  const docRef = collection(db, 'documents');
  
  const newDocData = {
    ...payload,
    status: 'pending',
    uploaderId: user.uid,
    uploaderName: user.name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    const addedDoc = await addDoc(docRef, newDocData);

    // Create initial audit trail
    const auditTrailRef = collection(db, 'documents', addedDoc.id, 'auditTrail');
    addDoc(auditTrailRef, {
      user: user.name,
      action: 'Created',
      date: serverTimestamp(),
    });

    // Create initial workflow (example)
    const workflowRef = collection(db, 'documents', addedDoc.id, 'workflow');
    addDoc(workflowRef, {
      approver: 'Bob Williams', // Example approver
      role: 'Manager',
      status: 'pending',
    });
    addDoc(workflowRef, {
      approver: 'Carol White', // Example approver
      role: 'Finance Head',
      status: 'pending',
    });

    return addedDoc;
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: newDocData,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the original error to be caught by the calling function
    throw serverError;
  }
};
