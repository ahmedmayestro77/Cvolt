import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export const getResumeFormSchema = (t: (key: string) => string) => z.object({
  fullName: z.string().min(2, { message: t('resumeForm.validation.fullNameRequired') }),
  email: z.string().email({ message: t('resumeForm.validation.invalidEmail') }),
  phone: z.string().optional(),
  linkedin: z.string().url({ message: t('resumeForm.validation.invalidUrl') }).optional().or(z.literal('')),
  summary: z.string().min(50, { message: t('resumeForm.validation.summaryMin') }),
  experience: z.string().min(50, { message: t('resumeForm.validation.experienceMin') }),
  education: z.string().min(50, { message: t('resumeForm.validation.educationMin') }),
  skills: z.string().min(10, { message: t('resumeForm.validation.skillsRequired') }),
});

export type ResumeFormValues = z.infer<ReturnType<typeof getResumeFormSchema>>;

interface ResumeFormProps {
  form: ReturnType<typeof useForm<ResumeFormValues>>;
  onSubmit: (values: ResumeFormValues) => void;
  buttonText: string;
  isSubmitting: boolean;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ form, onSubmit, buttonText, isSubmitting }) => {
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('resumeForm.summary')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('resumeForm.summaryPlaceholder')}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('resumeForm.experience')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('resumeForm.experiencePlaceholder')}
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('resumeForm.education')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('resumeForm.educationPlaceholder')}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('resumeForm.skills')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('resumeForm.skillsPlaceholder')}
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default ResumeForm;