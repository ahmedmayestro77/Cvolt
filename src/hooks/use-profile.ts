import { useQuery } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { Profile } from '@/contexts/AuthContext';

export const useProfile = () => {
  const { supabase, user } = useAuth();

  return useQuery<Profile | null, Error>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, subscription_status, stripe_customer_id, role')
        .eq('id', user.id)
        .single();

      if (error) {
        // It's common for a profile to not exist immediately after signup,
        // so we don't want to throw an error in that case.
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return data as Profile;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};