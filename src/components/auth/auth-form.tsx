'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { signIn, signUp } from '@/firebase/auth/auth';
import type { UserProfile } from '@/firebase/auth/auth';

type AuthMode = 'login' | 'signup';

export default function AuthForm({ defaultMode = 'login' }: { defaultMode?: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('Customer');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const modeParam = searchParams.get('mode') as AuthMode;
    if (modeParam && ['login', 'signup'].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [searchParams]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const user = await signIn(email, password);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.displayName || user.email}!`,
        });
        // The auth guard in the layout will handle redirection
        router.push('/dashboard'); 
      } else {
        // Signup
        if (!role) {
          toast({
            variant: 'destructive',
            title: 'Sign up failed',
            description: 'Please select a role.',
          });
          setIsLoading(false);
          return;
        }
        await signUp(email, password, name, role);
        toast({
          title: 'Account Created',
          description: 'Your account has been created. You can now log in.',
        });
        setMode('login'); // Switch to login view after successful signup
      }
    } catch (error: any) {
      let description = error.message || 'An unexpected error occurred.';
      // Provide a more helpful message if the API key is invalid
      if (error.code === 'auth/invalid-api-key') {
        description = "Authentication failed: The app is not configured with valid Firebase credentials. Please check your environment variables.";
      }
      toast({
        variant: 'destructive',
        title: mode === 'login' ? 'Login Failed' : 'Sign up Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    // You might want to clear form fields when toggling
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-muted/30">
      <div className="flex w-full max-w-sm flex-col items-center">
        <Logo className="w-14 h-14 mb-4 text-primary" />
        <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-1 font-headline">
          {mode === 'login' ? 'Sign in to FlowDocs Nexus' : 'Create an Account'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {mode === 'login'
            ? 'Enter your credentials to access your portal.'
            : 'Join FlowDocs Nexus to manage your documents.'}
        </p>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{mode === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthAction} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="role">I am a...</Label>
                  <Select
                    onValueChange={(value) =>
                      setRole(value as UserProfile['role'])
                    }
                    value={role}
                    required
                    disabled={isLoading}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-sm text-muted-foreground">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <Button variant="link" className="p-0 h-auto" onClick={toggleMode}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Button>
        </p>
      </div>
    </main>
  );
}
