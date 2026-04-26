'use client';

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { signOutUser } from '@/firebase/auth/auth';
import { useRouter } from 'next/navigation';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuthGuard(['Customer']);
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // The guard will handle redirection
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b bg-card sticky top-0 z-50">
        <div className="flex items-center gap-2 font-semibold">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-lg font-headline">
            FlowDocs Nexus{' '}
            <span className="text-sm font-normal text-muted-foreground">
              Customer Portal
            </span>
          </span>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
