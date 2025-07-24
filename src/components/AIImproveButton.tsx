import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';
import { ResumeFormValues } from '@/lib/resumeSchema';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface AIImproveButtonProps {
  fieldName: keyof ResumeFormValues;
  sectionName: 'summary' | 'experience' | 'education';
}

const AIImproveButton: React.FC<AIImproveButtonProps> = ({ fieldName, sectionName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { supabase, session } = useAuth();
  const { setValue, getValues } = useFormContext<ResumeFormValues>();
  const navigate = useNavigate();

  const handleImproveText = async () => {
    if (!session) {
      showError(t('resumeForm.validation.loginRequired'));
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    const currentText = getValues(fieldName);

    if (!currentText || (typeof currentText === 'string' && currentText.trim().length < 20)) {
      showError(t('resumeForm.validation.improveError'));
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('improve-resume-section', {
        body: { section: sectionName, text: currentText },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setValue(fieldName, data.improvedText, { shouldValidate: true, shouldDirty: true });

    } catch (err) {
      console.error('Error improving text:', err);
      showError(t('resumeForm.validation.improveFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleImproveText} disabled={isLoading} className="gap-2">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 text-primary" />
      )}
      {t('resumeForm.improveWithAI')}
    </Button>
  );
};

export default AIImproveButton;