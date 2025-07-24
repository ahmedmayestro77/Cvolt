import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { ResumeFormValues } from '@/lib/resumeSchema';
import AIImproveButton from '../AIImproveButton';

const EducationStep = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<ResumeFormValues>();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center mb-1">
              <FormLabel>{t('resumeForm.education')}</FormLabel>
              <AIImproveButton fieldName="education" sectionName="education" />
            </div>
            <FormControl>
              <Textarea
                placeholder={t('resumeForm.educationPlaceholder')}
                className="min-h-[200px]"
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

export default EducationStep;