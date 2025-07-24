import { z } from 'zod';

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