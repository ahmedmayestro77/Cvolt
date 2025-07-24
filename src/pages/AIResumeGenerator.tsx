import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';
import { ResumeFormValues } from '@/lib/resumeSchema';

const AIResumeGenerator = () => {
  const { t } = useTranslation();
  const { supabase } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showError(t('aiGenerator.validation.promptRequired'));
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-resume-with-ai', {
        body: { prompt },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const resumeData: ResumeFormValues = data;
      
      navigate('/create', { state: { aiGeneratedData: resumeData } });

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
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('aiGenerator.title', 'AI Resume Generator')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t('aiGenerator.description', 'Describe your ideal resume, and let our AI agents build it for you. Provide details like your role, experience, and skills.')}</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t('aiGenerator.prompt.title', 'Your Resume Prompt')}</CardTitle>
          <CardDescription>{t('aiGenerator.prompt.description', 'Example: "Create a resume for a senior frontend developer with 8 years of experience in React, TypeScript, and Next.js. I want to apply for jobs at innovative tech startups."')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t('aiGenerator.prompt.placeholder', 'Enter your resume description here...')}
            className="min-h-[200px] text-base"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t('aiGenerator.generatingButton', 'Generating...')}
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" /> {t('aiGenerator.generateButton', 'Generate with AI')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIResumeGenerator;