import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { ResumeFormValues } from '@/lib/resumeSchema';

const PersonalDetailsStep = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<ResumeFormValues>();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('resumeForm.fullName')}</FormLabel>
            <FormControl>
              <Input placeholder={t('resumeForm.fullNamePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('resumeForm.email')}</FormLabel>
            <FormControl>
              <Input type="email" placeholder={t('resumeForm.emailPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('resumeForm.phone')}</FormLabel>
            <FormControl>
              <Input type="tel" placeholder={t('resumeForm.phonePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="linkedin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('resumeForm.linkedin')}</FormLabel>
            <FormControl>
              <Input placeholder={t('resumeForm.linkedinPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalDetailsStep;