import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

interface AICoverLetterGeneratorProps {
  onGenerate: (content: string, jobTitle: string, companyName: string) => void;
}

const AICoverLetterGenerator: React.FC<AICoverLetterGeneratorProps> = ({ onGenerate }) => {
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

      onGenerate(data.coverLetterContent, jobTitle, companyName);
    } catch (err) {
      console.error(err);
      showError(t('aiGenerator.validation.generationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full mb-8">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Wand2 className="h-5 w-5" />
            {t('coverLetterGenerator.accordionTitle')}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
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
              className="min-h-[150px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-resume-text">{t('coverLetterGenerator.resumeText')}</Label>
            <Textarea
              id="ai-resume-text"
              placeholder={t('coverLetterGenerator.resumeTextPlaceholder')}
              className="min-h-[150px]"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
          <div className="text-right">
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {t('aiGenerator.generateButton')}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AICoverLetterGenerator;