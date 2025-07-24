import React from 'react';
import { useAdmin, AdminUser } from '@/hooks/use-admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Shield, User, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { showError } from '@/utils/toast';
import { Card } from '@/components/ui/card';

const UsersPage = () => {
  const { useGetAllUsers, useUpdateUserRole } = useAdmin();
  const { data: users, isLoading, isError } = useGetAllUsers();
  const { mutate: updateUserRole, isPending: isUpdatingRole } = useUpdateUserRole();

  if (isError) {
    showError("Failed to load users. You may not have permission.");
  }

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateUserRole({ userId, newRole });
    }
  };

  const RoleBadge = ({ role }: { role: AdminUser['role'] }) => {
    if (role === 'admin') {
      return <Badge variant="destructive"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>;
    }
    return <Badge variant="secondary"><User className="mr-1 h-3 w-3" /> User</Badge>;
  };

  const SubscriptionBadge = ({ status }: { status: AdminUser['subscription_status'] }) => {
    if (status === 'pro') {
      return <Badge className="bg-green-500 hover:bg-green-600 text-white"><Crown className="mr-1 h-3 w-3" /> Pro</Badge>;
    }
    return <Badge variant="outline">Free</Badge>;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
        User Management
      </h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.first_name || ''} {user.last_name || ''}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell><RoleBadge role={user.role} /></TableCell>
                  <TableCell><SubscriptionBadge status={user.subscription_status} /></TableCell>
                  <TableCell>
                    <div className="text-sm">Resumes: {user.resume_count}</div>
                    <div className="text-sm">Cover Letters: {user.cover_letter_count}</div>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isUpdatingRole}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.role !== 'admin' && (
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        {user.role === 'admin' && (
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')}>
                            Make User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default UsersPage;