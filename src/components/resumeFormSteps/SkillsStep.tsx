import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { ResumeFormValues } from '@/lib/resumeSchema';

const SkillsStep = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<ResumeFormValues>();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('resumeForm.skills')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('resumeForm.skillsPlaceholder')}
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SkillsStep;