'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  UserPlus,
  Trash2,
  Edit,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useUser, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  addUserProfile,
  updateUserProfile,
  deleteUserFromSystem,
  updateUserPassword,
} from '@/firebase/auth/auth';
import type { UserProfile } from '@/firebase/auth/auth';

function UserForm({
  user,
  currentUser,
  onSave,
  onCancel,
}: {
  user?: UserProfile | null;
  currentUser: UserProfile | null;
  onSave: (user: Partial<UserProfile>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'Customer',
  });
  const [isSaving, setIsSaving] = useState(false);

  const isEditingSelf = user?.uid === currentUser?.uid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as UserProfile['role'] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={!!user} // Don't allow email changes after creation
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder={
            user
              ? isEditingSelf
                ? 'Leave blank to keep unchanged'
                : 'Password can only be changed by the user'
              : 'User will be invited to set a password'
          }
          value={formData.password}
          onChange={handleChange}
          required={isEditingSelf && !user} // Only require for new user creation when editing self? Logic seems complex. Simplfy.
          disabled={user && !isEditingSelf}
        />
        {!user && <p className="text-xs text-muted-foreground">A new user cannot be created with a password from the admin panel. They will be invited to sign up.</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          onValueChange={handleRoleChange}
          value={formData.role}
          required
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Employee">Employee</SelectItem>
            <SelectItem value="Customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" /> : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function UsersPage() {
  const { user: currentUser } = useUser();
  const db = useFirestore();
  const { data: users, loading } = useCollection(collection(db, 'users'));

  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const getBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'default';
      case 'Employee':
        return 'secondary';
      case 'Customer':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleAddUser = async (newUser: Partial<UserProfile>) => {
    try {
      await addUserProfile(db, {
        name: newUser.name!,
        email: newUser.email!,
        role: newUser.role as UserProfile['role'],
      });
      toast({
        title: 'User Added',
        description: `${newUser.name} has been added. They will need to sign up to create their account.`,
      });
      setAddUserDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error adding user',
        description: error.message,
      });
    }
  };

  const handleUpdateUser = async (updatedUserData: Partial<UserProfile>) => {
    if (!userToEdit) return;
    try {
      // Update profile data in Firestore
      await updateUserProfile(db, userToEdit.uid!, {
        name: updatedUserData.name,
        role: updatedUserData.role as UserProfile['role'],
      });

      // Update password if it was changed (only possible if editing self)
      if (updatedUserData.password && userToEdit.uid === currentUser?.uid) {
        await updateUserPassword(updatedUserData.password);
      }

      toast({
        title: 'User Updated',
        description: `${updatedUserData.name}'s information has been updated.`,
      });
      setUserToEdit(null);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating user',
        description: error.message,
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserFromSystem(db, userToDelete.uid!);
      toast({
        title: 'User Deleted',
        description: `${userToDelete.name} has been removed.`,
      });
      setUserToDelete(null);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error deleting user',
        description: error.message,
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-headline">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage employees, administrators, and customers.
            </p>
          </div>
          <Dialog
            open={isAddUserDialogOpen}
            onOpenChange={setAddUserDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Fill out the form to add a new user profile to the system.
                </DialogDescription>
              </DialogHeader>
              <UserForm
                currentUser={currentUser}
                onSave={handleAddUser}
                onCancel={() => setAddUserDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A list of all users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.avatar}
                              data-ai-hint="person avatar"
                            />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{user.name}</span>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getBadgeVariant(user.role)}
                          className="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => setUserToEdit(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"
                              onSelect={() => setUserToDelete(user)}
                              disabled={user.uid === currentUser?.uid}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog
        open={!!userToEdit}
        onOpenChange={(isOpen) => !isOpen && setUserToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's details and role.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={userToEdit}
            currentUser={currentUser}
            onSave={handleUpdateUser}
            onCancel={() => setUserToEdit(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              account for {userToDelete?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
