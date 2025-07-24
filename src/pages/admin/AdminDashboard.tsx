import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, FileSignature } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminStats {
  userCount: number;
  resumeCount: number;
  coverLetterCount: number;
}

const AdminDashboard = () => {
  const { supabase } = useAuth();

  const { data: stats, isLoading, isError } = useQuery<AdminStats, Error>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-admin-stats');
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isError) {
    showError("Failed to load admin statistics. You may not have permission.");
  }

  const StatCard = ({ title, value, icon: Icon, isLoading }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value ?? 0}</div>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats?.userCount} icon={Users} isLoading={isLoading} />
        <StatCard title="Total Resumes" value={stats?.resumeCount} icon={FileText} isLoading={isLoading} />
        <StatCard title="Total Cover Letters" value={stats?.coverLetterCount} icon={FileSignature} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AdminDashboard;