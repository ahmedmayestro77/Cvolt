import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';

const CoverLetterGenerator = () => {
  const { t } = useTranslation();
  const { supabase, session } = useAuth();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!session) {
      showError(t('resumeForm.validation.loginRequired'));
      navigate('/auth');
      return;
    }
    if (!jobDescription.trim() || !resumeText.trim()) {
      showError(t('coverLetterGenerator.validation.required'));
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
        body: { jobDescription, resumeText },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      navigate('/cover-letter/create', {
        state: {
          aiGeneratedData: {
            job_title: jobTitle,
            company_name: companyName,
            content: data.coverLetterContent,
          },
        },
      });
    } catch (err) {
      console.error(err);
      showError(t('aiGenerator.validation.generationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('coverLetterGenerator.title', 'AI Cover Letter Generator')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t('coverLetterGenerator.description', 'Provide your resume and a job description, and let our AI write a compelling cover letter for you.')}</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t('coverLetterGenerator.formTitle', 'Enter Details')}</CardTitle>
          <CardDescription>{t('coverLetterGenerator.formDescription', 'The more detail you provide, the better the result.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ai-job-title">{t('coverLetterForm.jobTitle')}</Label>
              <Input id="ai-job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder={t('coverLetterForm.jobTitlePlaceholder')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-company-name">{t('coverLetterForm.companyName')}</Label>
              <Input id="ai-company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={t('coverLetterForm.companyNamePlaceholder')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-job-description">{t('coverLetterGenerator.jobDescription')}</Label>
            <Textarea
              id="ai-job-description"
              placeholder={t('coverLetterGenerator.jobDescriptionPlaceholder')}
              className="min-h-[200px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-resume-text">{t('coverLetterGenerator.resumeText')}</Label>
            <Textarea
              id="ai-resume-text"
              placeholder={t('coverLetterGenerator.resumeTextPlaceholder')}
              className="min-h-[200px]"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
          <div className="text-right">
            <Button size="lg" onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {t('aiGenerator.generateButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterGenerator;