import type { Timestamp } from 'firebase/firestore';

export type Document = {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  uploaderId: string;
  uploaderName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata: Record<string, string>;
  workflow?: any[];
  auditTrail?: any[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Employee' | 'Customer';
  avatar: string;
};
