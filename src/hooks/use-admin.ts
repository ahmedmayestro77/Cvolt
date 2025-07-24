import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { showError, showSuccess } from '@/utils/toast';

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user' | null;
  subscription_status: 'free' | 'pro' | null;
  resume_count: number;
  cover_letter_count: number;
}

export const useAdmin = () => {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const useGetAllUsers = () => useQuery<AdminUser[], Error>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-all-users');
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const useUpdateUserRole = () => useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: 'admin' | 'user' }) => {
      const { data, error } = await supabase.functions.invoke('update-user-role', {
        body: { userId, newRole },
      });
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showSuccess("User role updated successfully!");
    },
    onError: (error) => {
      showError(`Failed to update role: ${error.message}`);
    },
  });

  return { useGetAllUsers, useUpdateUserRole };
};