import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { showError, showSuccess } from '@/utils/toast';

// The shape of the cover letter data in the frontend
export interface CoverLetter {
  id: string;
  user_id: string;
  job_title: string;
  company_name?: string;
  content: string;
  created_at: string;
  last_modified: string;
}

// The shape of the data to be inserted/updated in Supabase
export type CoverLetterPayload = {
  job_title: string;
  company_name?: string;
  content: string;
};

export const useCoverLetters = () => {
  const { supabase, session } = useAuth();
  const queryClient = useQueryClient();

  // Query to fetch all cover letters for the current user
  const useGetCoverLetters = () => useQuery<CoverLetter[], Error>({
    queryKey: ['cover-letters', session?.user?.id],
    queryFn: async () => {
      if (!session) return [];
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  // Query to fetch a single cover letter by ID
  const useGetCoverLetterById = (id: string | undefined) => useQuery<CoverLetter | undefined, Error>({
    queryKey: ['cover-letters', id],
    queryFn: async () => {
      if (!id || !session) return undefined;
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!session,
  });

  // Mutation to add a new cover letter
  const useAddCoverLetter = () => useMutation({
    mutationFn: async (coverLetterData: CoverLetterPayload) => {
      if (!session) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('cover_letters')
        .insert(coverLetterData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters', session?.user?.id] });
      showSuccess('Cover letter created successfully!');
    },
    onError: (error) => {
      showError('Failed to create cover letter.');
      console.error(error);
    },
  });

  // Mutation to update an existing cover letter
  const useUpdateCoverLetter = () => useMutation({
    mutationFn: async ({ id, updatedValues }: { id: string, updatedValues: CoverLetterPayload }) => {
      if (!session) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('cover_letters')
        .update({ ...updatedValues, last_modified: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters', session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ['cover-letters', data.id] });
      showSuccess('Cover letter updated successfully!');
    },
    onError: (error) => {
      showError('Failed to update cover letter.');
      console.error(error);
    },
  });

  // Mutation to delete a cover letter
  const useDeleteCoverLetter = () => useMutation({
    mutationFn: async (id: string) => {
      if (!session) throw new Error('User not authenticated');
      const { error } = await supabase.from('cover_letters').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters', session?.user?.id] });
      showSuccess('Cover letter deleted successfully.');
    },
    onError: (error) => {
      showError('Failed to delete cover letter.');
      console.error(error);
    },
  });

  return {
    useGetCoverLetters,
    useGetCoverLetterById,
    useAddCoverLetter,
    useUpdateCoverLetter,
    useDeleteCoverLetter,
  };
};