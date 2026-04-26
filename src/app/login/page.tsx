'use client';

import { Suspense } from 'react';
import AuthForm from '@/components/auth/auth-form';

function LoginPageContent() {
  return <AuthForm />;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
