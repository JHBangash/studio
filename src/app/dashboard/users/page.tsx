import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { appUsers } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UsersPage() {
  const getBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "default";
      case "Employee":
        return "secondary";
      case "Customer":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">User Management</h1>
          <p className="text-muted-foreground">
            Manage employees, administrators, and customers.
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appUsers.map((user) => (
                <TableRow key={user.id}>
                    <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="font-medium">{user.name}</span>
                            <div className="text-xs text-muted-foreground md:hidden">{user.email}</div>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                    <TableCell>
                    <Badge variant={getBadgeVariant(user.role)} className="capitalize">{user.role}</Badge>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
