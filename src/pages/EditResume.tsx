import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumes } from '@/hooks/use-resumes';
import { useNavigate, useParams } from 'react-router-dom';
import { getResumeFormSchema, ResumeFormValues } from '@/lib/resumeSchema';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { showError } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import ResumeStepper from '@/components/ResumeStepper';
import PersonalDetailsStep from '@/components/resume-form-steps/PersonalDetailsStep';
import SummaryStep from '@/components/resume-form-steps/SummaryStep';
import ExperienceStep from '@/components/resume-form-steps/ExperienceStep';
import EducationStep from '@/components/resume-form-steps/EducationStep';
import SkillsStep from '@/components/resume-form-steps/SkillsStep';
import ResumePreview from '@/components/ResumePreview';

const EditResume = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetResumeById, useUpdateResume } = useResumes();
  const [currentStep, setCurrentStep] = useState(0);

  const { data: resumeToEdit, isLoading: loading } = useGetResumeById(id);
  const updateResumeMutation = useUpdateResume();

  const resumeFormSchema = getResumeFormSchema(t);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", linkedin: "",
      summary: "", experience: "", education: "", skills: "",
    },
    mode: 'onChange',
  });

  const watchedValues = form.watch();

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="lg:overflow-y-auto">
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
                      <Button type="submit" disabled={updateResumeMutation.isPending}>
                        {updateResumeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('resumeForm.updateButton')}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:flex justify-center items-start py-8">
        <ResumePreview resume={watchedValues} />
      </div>
    </div>
  );
};

export default EditResume;