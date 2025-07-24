import { useState, useEffect, useCallback } from 'react';
import { ResumeFormValues } from '@/components/ResumeForm';
import { useAuth } from './use-auth';
import { showError } from '@/utils/toast';

// The shape of the resume data in the frontend
export interface Resume extends ResumeFormValues {
  id: string;
  last_modified: string;
}

// The shape of the data to be inserted/updated in Supabase
// Using snake_case to match database columns
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

export const useResumes = () => {
  const { supabase, session } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = useCallback(async () => {
    if (!session) {
      setResumes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      // Map from snake_case (db) to camelCase (js)
      const formattedData = data.map(r => ({ ...r, fullName: r.full_name, lastModified: r.last_modified }))
      setResumes(formattedData || []);
    } catch (error) {
      showError('Failed to fetch resumes.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [supabase, session]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const addResume = async (newResume: ResumeFormValues) => {
    if (!session) throw new Error('User not authenticated');

    const payload: ResumePayload = {
      full_name: newResume.fullName,
      email: newResume.email,
      phone: newResume.phone,
      linkedin: newResume.linkedin,
      summary: newResume.summary,
      experience: newResume.experience,
      education: newResume.education,
      skills: newResume.skills,
    };

    const { data, error } = await supabase
      .from('resumes')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    
    await fetchResumes(); // Re-fetch to update the list
    return data;
  };

  const updateResume = async (id: string, updatedValues: ResumeFormValues) => {
    if (!session) throw new Error('User not authenticated');

    const payload: ResumePayload = {
      full_name: updatedValues.fullName,
      email: updatedValues.email,
      phone: updatedValues.phone,
      linkedin: updatedValues.linkedin,
      summary: updatedValues.summary,
      experience: updatedValues.experience,
      education: updatedValues.education,
      skills: updatedValues.skills,
    };

    const { data, error } = await supabase
      .from('resumes')
      .update({ ...payload, last_modified: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;

    await fetchResumes(); // Re-fetch to update the list
    return data;
  };

  const deleteResume = async (id: string) => {
    if (!session) throw new Error('User not authenticated');

    const { error } = await supabase.from('resumes').delete().eq('id', id);
    if (error) throw error;

    setResumes((prevResumes) => prevResumes.filter((resume) => resume.id !== id));
  };

  const getResumeById = async (id: string) => {
    if (!session) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Map from snake_case (db) to camelCase (js)
      return { ...data, fullName: data.full_name, lastModified: data.last_modified };
    } catch (error) {
      showError('Failed to fetch resume details.');
      console.error(error);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return {
    resumes,
    loading,
    addResume,
    updateResume,
    deleteResume,
    getResumeById,
  };
};