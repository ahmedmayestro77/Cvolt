import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, FileSignature, Star, Crown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AdminStats {
  userCount: number;
  resumeCount: number;
  coverLetterCount: number;
  proUserCount: number;
  freeUserCount: number;
}

interface UserGrowthData {
  date: string;
  count: number;
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

  const { data: growthData, isLoading: isLoadingGrowth } = useQuery<UserGrowthData[], Error>({
    queryKey: ['admin-growth-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-user-growth-stats');
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      return data;
    },
    staleTime: 5 * 60 * 1000,
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

  const pieData = [
    { name: 'Pro Users', value: stats?.proUserCount ?? 0 },
    { name: 'Free Users', value: stats?.freeUserCount ?? 0 },
  ];
  const COLORS = ['#10B981', '#6B7280'];

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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard title="Pro Users" value={stats?.proUserCount} icon={Crown} isLoading={isLoading} />
            <StatCard title="Free Users" value={stats?.freeUserCount} icon={Star} isLoading={isLoading} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Users (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {isLoadingGrowth ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;