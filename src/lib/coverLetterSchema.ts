import { z } from 'zod';
import { TFunction } from 'i18next';

export const getCoverLetterFormSchema = (t: TFunction) => z.object({
  job_title: z.string().min(2, { message: t('coverLetterForm.validation.jobTitleRequired', 'Job title is required.') }),
  company_name: z.string().optional(),
  content: z.string().min(100, { message: t('coverLetterForm.validation.contentMin', 'Content must be at least 100 characters.') }),
});

export type CoverLetterFormValues = z.infer<ReturnType<typeof getCoverLetterFormSchema>>;