import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex w-full max-w-sm flex-col items-center">
        <Logo className="w-14 h-14 mb-4 text-primary" />
        <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-1 font-headline">
          Sign in to FlowDocs Nexus
        </h1>
        <p className="text-muted-foreground mb-6">
          Enter your credentials to access your portal.
        </p>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button className="w-full" type="submit" disabled>
              Sign In
            </Button>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <Card className="w-full bg-muted/50 border-dashed">
            <CardHeader>
                <CardTitle className="text-base">Demo Credentials</CardTitle>
                <CardDescription className="text-xs">Use these mock accounts to explore the different portals. A real login system would require a database and session management.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                <p><b>Admin/Employee:</b><br />Email: <code className="bg-card p-1 rounded-sm">admin@nexus.com</code><br />Password: <code className="bg-card p-1 rounded-sm">password123</code></p>
                 <p><b>Customer:</b><br />Email: <code className="bg-card p-1 rounded-sm">customer@client.com</code><br />Password: <code className="bg-card p-1 rounded-sm">password123</code></p>
                 <div className="pt-2 text-xs text-muted-foreground">
                    After "logging in", navigate to the correct portal: <Link href="/dashboard" className="underline hover:text-primary">Employee</Link> or <Link href="/portal" className="underline hover:text-primary">Customer</Link>.
                 </div>
            </CardContent>
        </Card>
        
        <p className="mt-8 text-xs text-muted-foreground">
          <Link href="/" className="underline hover:text-primary">Back to home</Link>
        </p>
      </div>
    </main>
  );
}
