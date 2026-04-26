import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/logo';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-muted/20">
      <div className="flex flex-col items-center justify-center w-full max-w-md text-center">
        <Logo className="w-20 h-20 mb-6 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter text-foreground mb-2 font-headline">
          Welcome to FlowDocs Nexus
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          A unified portal for document management, review, and approval for
          your entire organization.
        </p>

        <div className="grid w-full grid-cols-1 gap-4">
           <Card className="hover:shadow-lg transition-shadow text-left">
            <CardHeader>
              <CardTitle>Login to Your Portal</CardTitle>
              <CardDescription>Access employee and customer portals through a single login.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">
                  Sign In or Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FlowDocs Nexus. All rights reserved.
        </p>
      </div>
    </main>
  );
}
