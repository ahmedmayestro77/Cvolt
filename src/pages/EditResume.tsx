import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccess, showError } from '@/utils/toast';
import { useResumes } from '@/hooks/use-resumes';
import { useNavigate, useParams } from 'react-router-dom';
import ResumeForm, { getResumeFormSchema, ResumeFormValues } from '@/components/ResumeForm';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const EditResume = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getResumeById, updateResume } = useResumes();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const resumeFormSchema = getResumeFormSchema(t);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      summary: "",
      experience: "",
      education: "",
      skills: "",
    },
  });

  useEffect(() => {
    if (!id) {
      navigate('/my-resumes');
      return;
    }

    const fetchResume = async () => {
      setLoading(true);
      const resumeToEdit = await getResumeById(id);
      if (resumeToEdit) {
        form.reset(resumeToEdit);
      } else {
        showError(t('editResume.notFound'));
        navigate('/my-resumes');
      }
      setLoading(false);
    };

    fetchResume();
  }, [id, getResumeById, form, navigate, t]);

  const onSubmit = async (values: ResumeFormValues) => {
    if (!id) return;
    try {
      await updateResume(id, values);
      showSuccess(t('editResume.updateSuccess'));
      navigate('/my-resumes');
    } catch (error) {
      console.error("Failed to update resume:", error);
      showError(t('editResume.updateError'));
    }
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
            isSubmitting={form.formState.isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditResume;