import React from 'react';
import { useParams } from 'react-router-dom';
import { useResumes } from '@/hooks/use-resumes';
import ResumeForm from '@/components/ResumeForm';

const EditResume = () => {
  const { id } = useParams<{ id: string }>();
  const { useGetResumeById } = useResumes();
  const { data: resumeToEdit, isLoading } = useGetResumeById(id);

  return (
    <ResumeForm
      mode="edit"
      resumeToEdit={resumeToEdit}
      isLoading={isLoading}
    />
  );
};

export default EditResume;