import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b bg-card">
        <Link href="/portal" className="flex items-center gap-2 font-semibold">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-lg font-headline">FlowDocs Nexus <span className="text-sm font-normal text-muted-foreground">Customer Portal</span></span>
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </header>
      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
