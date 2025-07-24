import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccess, showError } from '@/utils/toast';
import { useResumeStore } from '@/hooks/use-resume-store';
import { useNavigate } from 'react-router-dom';
import ResumeForm, { getResumeFormSchema, ResumeFormValues } from '@/components/ResumeForm';
import { useTranslation } from 'react-i18next';

const CreateResume = () => {
  const { t } = useTranslation();
  const { addResume } = useResumeStore();
  const navigate = useNavigate();

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

  const onSubmit = (values: ResumeFormValues) => {
    try {
      addResume(values);
      showSuccess(t('createResume.createSuccess'));
      navigate('/my-resumes');
    } catch (error) {
      console.error("Failed to create resume:", error);
      showError(t('createResume.createError'));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('createResume.title')}</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        {t('createResume.description')}
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t('createResume.cardTitle')}</CardTitle>
          <CardDescription>{t('createResume.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeForm
            form={form}
            onSubmit={onSubmit}
            buttonText={t('resumeForm.createButton')}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateResume;