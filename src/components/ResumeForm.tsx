import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getResumeFormSchema, ResumeFormValues } from '@/lib/resumeSchema';
import { useTranslation } from 'react-i18next';
import { useResumes, Resume } from '@/hooks/use-resumes';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResumeStepper from '@/components/ResumeStepper';
import PersonalDetailsStep from '@/components/resume-form-steps/PersonalDetailsStep';
import SummaryStep from '@/components/resume-form-steps/SummaryStep';
import ExperienceStep from '@/components/resume-form-steps/ExperienceStep';
import EducationStep from '@/components/resume-form-steps/EducationStep';
import SkillsStep from '@/components/resume-form-steps/SkillsStep';
import ResumePreview from '@/components/ResumePreview';
import { showError } from '@/utils/toast';
import AIResumePromptDialog from './AIResumePromptDialog';

interface ResumeFormProps {
  mode: 'create' | 'edit';
  resumeToEdit?: Resume | ResumeFormValues | null;
  isLoading?: boolean;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ mode, resumeToEdit, isLoading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { useAddResume, useUpdateResume } = useResumes();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const addResumeMutation = useAddResume();
  const updateResumeMutation = useUpdateResume();

  const isSubmitting = addResumeMutation.isPending || updateResumeMutation.isPending;
  const templateSlug = (resumeToEdit as Resume)?.template_slug || searchParams.get('template') || 'modern-minimalist';

  const resumeFormSchema = getResumeFormSchema(t);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: resumeToEdit || {
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
    if (location.state?.openAiDialog) {
      setIsAiDialogOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (mode === 'edit' && !isLoading && !resumeToEdit) {
      showError(t('editResume.notFound'));
      navigate('/my-resumes');
    }
  }, [isLoading, resumeToEdit, mode, navigate, t]);

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

  const handleOpenAiDialog = () => {
    setIsAiDialogOpen(true);
  };

  const onSubmit = (values: ResumeFormValues) => {
    if (mode === 'create') {
      addResumeMutation.mutate({ resumeData: values, templateSlug }, {
        onSuccess: () => navigate('/my-resumes'),
      });
    } else if (resumeToEdit && 'id' in resumeToEdit) {
      updateResumeMutation.mutate({ id: (resumeToEdit as Resume).id, updatedValues: values, templateSlug }, {
        onSuccess: () => navigate('/my-resumes'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        <div className="lg:overflow-y-auto">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-8 pt-4">
                <ResumeStepper steps={steps} currentStep={currentStep} />
              </div>
              <div className="flex justify-between items-center">
                <CardTitle className="text-center text-2xl flex-grow">{steps[currentStep].name}</CardTitle>
                {mode === 'create' && (
                  <Button variant="outline" size="sm" onClick={handleOpenAiDialog} className="gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    {t('aiGenerator.generateButton')}
                  </Button>
                )}
              </div>
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
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {mode === 'create' ? t('resumeForm.createButton') : t('resumeForm.updateButton')}
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
          <ResumePreview resume={watchedValues} templateSlug={templateSlug} />
        </div>
      </div>
      <AIResumePromptDialog
        isOpen={isAiDialogOpen}
        onClose={() => setIsAiDialogOpen(false)}
        onGenerate={(data) => {
          form.reset(data);
          setIsAiDialogOpen(false);
        }}
      />
    </>
  );
};

export default ResumeForm;