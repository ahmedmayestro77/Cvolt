import { useState, useEffect } from 'react';

export interface Resume {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  lastModified: string;
}

const LOCAL_STORAGE_KEY = 'cvolt_resumes';

export const useResumeStore = () => {
  const [resumes, setResumes] = useState<Resume[]>(() => {
    if (typeof window !== 'undefined') {
      const savedResumes = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedResumes ? JSON.parse(savedResumes) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumes));
    }
  }, [resumes]);

  const addResume = (newResume: Omit<Resume, 'id' | 'lastModified'>) => {
    const id = Date.now().toString(); // Simple unique ID
    const lastModified = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const resumeWithId: Resume = { ...newResume, id, lastModified };
    setResumes((prevResumes) => [...prevResumes, resumeWithId]);
    return resumeWithId;
  };

  const updateResume = (updatedResume: Resume) => {
    setResumes((prevResumes) =>
      prevResumes.map((resume) =>
        resume.id === updatedResume.id ? { ...updatedResume, lastModified: new Date().toISOString().split('T')[0] } : resume
      )
    );
  };

  const deleteResume = (id: string) => {
    setResumes((prevResumes) => prevResumes.filter((resume) => resume.id !== id));
  };

  const getResumeById = (id: string) => {
    return resumes.find(resume => resume.id === id);
  };

  return {
    resumes,
    addResume,
    updateResume,
    deleteResume,
    getResumeById,
  };
};