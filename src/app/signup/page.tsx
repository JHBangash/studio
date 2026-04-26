'use client';

import { Suspense } from 'react';
import AuthForm from '@/components/auth/auth-form';

function SignupPageContent() {
  return <AuthForm defaultMode="signup" />;
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupPageContent />
    </Suspense>
  );
}
