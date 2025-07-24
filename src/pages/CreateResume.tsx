import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { getResumeFormSchema, ResumeFormValues } from '@/lib/resumeSchema';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { useResumes } from '@/hooks/use-resumes';
import { Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResumeStepper from '@/components/ResumeStepper';
import PersonalDetailsStep from '@/components/resumeFormSteps/PersonalDetailsStep';
import SummaryStep from '@/components/resumeFormSteps/SummaryStep';
import ExperienceStep from '@/components/resumeFormSteps/ExperienceStep';
import EducationStep from '@/components/resumeFormSteps/EducationStep';
import SkillsStep from '@/components/resumeFormSteps/SkillsStep';

const CreateResume = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { useGetResumes, useAddResume } = useResumes();
  const [currentStep, setCurrentStep] = useState(0);

  const { data: resumes, isLoading: resumesLoading } = useGetResumes();
  const addResumeMutation = useAddResume();

  const resumeFormSchema = getResumeFormSchema(t);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", linkedin: "",
      summary: "", experience: "", education: "", skills: "",
    },
    mode: 'onChange',
  });

  const steps = [
    { name: t('resumeForm.steps.personal'), fields: ['fullName', 'email', 'phone', 'linkedin'], component: <PersonalDetailsStep /> },
    { name: t('resumeForm.steps.summary'), fields: ['summary'], component: <SummaryStep /> },
    { name: t('resumeForm.steps.experience'), fields: ['experience'], component: <ExperienceStep /> },
    { name: t('resumeForm.steps.education'), fields: ['education'], component: <EducationStep /> },
    { name: t('resumeForm.steps.skills'), fields: ['skills'], component: <SkillsStep /> },
  ];

  const handleNextStep = async () => {
    const fields = steps[currentStep].fields as (keyof ResumeFormValues)[];
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = (values: ResumeFormValues) => {
    addResumeMutation.mutate(values, {
      onSuccess: () => {
        navigate('/my-resumes');
      },
    });
  };

  if (resumesLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
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
            <Link to="/pricing"><Button><Star className="mr-2 h-4 w-4" /> Upgrade to Pro</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('createResume.title')}</h1>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-8 pt-4">
            <ResumeStepper steps={steps} currentStep={currentStep} />
          </div>
          <CardTitle className="text-center text-2xl">{steps[currentStep].name}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="min-h-[300px]">
                {steps[currentStep].component}
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      {t('resumeForm.previousButton')}
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < steps.length - 1 && (
                    <Button type="button" onClick={handleNextStep}>
                      {t('resumeForm.nextButton')}
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button type="submit" disabled={addResumeMutation.isPending}>
                      {addResumeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('resumeForm.createButton')}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateResume;