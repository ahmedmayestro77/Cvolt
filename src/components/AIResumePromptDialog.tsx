import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';
import { ResumeFormValues } from '@/lib/resumeSchema';

interface AIResumePromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: ResumeFormValues) => void;
}

const AIResumePromptDialog: React.FC<AIResumePromptDialogProps> = ({ isOpen, onClose, onGenerate }) => {
  const { t } = useTranslation();
  const { supabase } = useAuth();
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

      onGenerate(data as ResumeFormValues);
      onClose();
    } catch (err) {
      console.error(err);
      showError(t('aiGenerator.validation.generationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('aiGenerator.title', 'AI Resume Generator')}</DialogTitle>
          <DialogDescription>{t('aiGenerator.prompt.description', 'Example: "Create a resume for a senior frontend developer with 8 years of experience in React, TypeScript, and Next.js. I want to apply for jobs at innovative tech startups."')}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="ai-prompt">{t('aiGenerator.prompt.title', 'Your Resume Prompt')}</Label>
          <Textarea
            id="ai-prompt"
            placeholder={t('aiGenerator.prompt.placeholder', 'Enter your resume description here...')}
            className="min-h-[150px] mt-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {t('aiGenerator.generateButton', 'Generate with AI')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIResumePromptDialog;