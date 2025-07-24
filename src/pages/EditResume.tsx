import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumes } from '@/hooks/use-resumes';
import { useNavigate, useParams } from 'react-router-dom';
import ResumeForm, { getResumeFormSchema, ResumeFormValues } from '@/components/ResumeForm';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { showError } from '@/utils/toast';

const EditResume = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetResumeById, useUpdateResume } = useResumes();

  const { data: resumeToEdit, isLoading: loading } = useGetResumeById(id);
  const updateResumeMutation = useUpdateResume();

  const resumeFormSchema = getResumeFormSchema(t);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", linkedin: "",
      summary: "", experience: "", education: "", skills: "",
    },
  });

  useEffect(() => {
    if (resumeToEdit) {
      form.reset(resumeToEdit);
    }
  }, [resumeToEdit, form]);
  
  useEffect(() => {
    if (!loading && !resumeToEdit) {
      showError(t('editResume.notFound'));
      navigate('/my-resumes');
    }
  }, [loading, resumeToEdit, navigate, t]);

  const onSubmit = async (values: ResumeFormValues) => {
    if (!id) return;
    updateResumeMutation.mutate({ id, updatedValues: values }, {
      onSuccess: () => {
        navigate('/my-resumes');
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center flex justify-center items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('editResume.title')}</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        {t('editResume.description')}
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t('editResume.cardTitle')}</CardTitle>
          <CardDescription>{t('editResume.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeForm
            form={form}
            onSubmit={onSubmit}
            buttonText={t('resumeForm.updateButton')}
            isSubmitting={updateResumeMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditResume;