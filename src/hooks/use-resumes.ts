import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResumeFormValues } from '@/lib/resumeSchema';
import { useAuth } from './use-auth';
import { showError, showSuccess } from '@/utils/toast';

// The shape of the resume data in the frontend
export interface Resume extends ResumeFormValues {
  id: string;
  last_modified: string;
  created_at: string;
  user_id: string;
}

// The shape of the data to be inserted/updated in Supabase
type ResumePayload = {
  full_name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
};

// Helper to map db snake_case to frontend camelCase
const fromSupabase = (dbResume: any): Resume => ({
  id: dbResume.id,
  fullName: dbResume.full_name,
  email: dbResume.email,
  phone: dbResume.phone,
  linkedin: dbResume.linkedin,
  summary: dbResume.summary,
  experience: dbResume.experience,
  education: dbResume.education,
  skills: dbResume.skills,
  last_modified: dbResume.last_modified,
  created_at: dbResume.created_at,
  user_id: dbResume.user_id,
});

// Helper to map frontend camelCase to db snake_case
const toSupabase = (resume: ResumeFormValues): ResumePayload => ({
  full_name: resume.fullName,
  email: resume.email,
  phone: resume.phone,
  linkedin: resume.linkedin,
  summary: resume.summary,
  experience: resume.experience,
  education: resume.education,
  skills: resume.skills,
});


export const useResumes = () => {
  const { supabase, session } = useAuth();
  const queryClient = useQueryClient();

  // Query to fetch all resumes for the current user
  const useGetResumes = () => useQuery<Resume[], Error>({
    queryKey: ['resumes', session?.user?.id],
    queryFn: async () => {
      if (!session) return [];
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(fromSupabase);
    },
    enabled: !!session,
  });

  // Query to fetch a single resume by ID
  const useGetResumeById = (id: string | undefined) => useQuery<Resume | undefined, Error>({
    queryKey: ['resumes', id],
    queryFn: async () => {
      if (!id || !session) return undefined;
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return fromSupabase(data);
    },
    enabled: !!id && !!session,
  });

  // Mutation to add a new resume
  const useAddResume = () => useMutation({
    mutationFn: async (newResume: ResumeFormValues) => {
      if (!session) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('resumes')
        .insert(toSupabase(newResume))
        .select()
        .single();
      if (error) throw error;
      return fromSupabase(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes', session?.user?.id] });
      showSuccess('Resume created successfully!');
    },
    onError: (error) => {
      showError('Failed to create resume.');
      console.error(error);
    },
  });

  // Mutation to update an existing resume
  const useUpdateResume = () => useMutation({
    mutationFn: async ({ id, updatedValues }: { id: string, updatedValues: ResumeFormValues }) => {
      if (!session) throw new Error('User not authenticated');
      const payload = toSupabase(updatedValues);
      const { data, error } = await supabase
        .from('resumes')
        .update({ ...payload, last_modified: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return fromSupabase(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resumes', session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ['resumes', data.id] });
      showSuccess('Resume updated successfully!');
    },
    onError: (error) => {
      showError('Failed to update resume.');
      console.error(error);
    },
  });

  // Mutation to delete a resume
  const useDeleteResume = () => useMutation({
    mutationFn: async (id: string) => {
      if (!session) throw new Error('User not authenticated');
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes', session?.user?.id] });
      showSuccess('Resume deleted successfully.');
    },
    onError: (error) => {
      showError('Failed to delete resume.');
      console.error(error);
    },
  });

  return {
    useGetResumes,
    useGetResumeById,
    useAddResume,
    useUpdateResume,
    useDeleteResume,
  };
};