import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import ResumeForm, { getResumeFormSchema, ResumeFormValues } from '@/components/ResumeForm';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { useResumes } from '@/hooks/use-resumes';
import { Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateResume = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { useGetResumes, useAddResume } = useResumes();

  const { data: resumes, isLoading: resumesLoading } = useGetResumes();
  const addResumeMutation = useAddResume();

  const resumeFormSchema = getResumeFormSchema(t);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", linkedin: "",
      summary: "", experience: "", education: "", skills: "",
    },
  });

  const onSubmit = (values: ResumeFormValues) => {
    addResumeMutation.mutate(values, {
      onSuccess: () => {
        navigate('/my-resumes');
      },
    });
  };

  if (resumesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (profile?.subscription_status === 'free' && resumes && resumes.length >= 1) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="max-w-lg mx-auto mt-10">
          <CardHeader>
            <CardTitle>Free Plan Limit Reached</CardTitle>
            <CardDescription>You can only create one resume on the Free plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Upgrade to Pro to create unlimited resumes and unlock all premium features.</p>
            <Link to="/pricing">
              <Button>
                <Star className="mr-2 h-4 w-4" /> Upgrade to Pro
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('createResume.title')}</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">{t('createResume.description')}</p>
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
            isSubmitting={addResumeMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateResume;