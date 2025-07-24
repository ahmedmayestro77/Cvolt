import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const resumeFormSchema = z.object({
  fullName: z.string().min(2, { message: "الاسم الكامل مطلوب." }),
  email: z.string().email({ message: "بريد إلكتروني غير صالح." }),
  phone: z.string().optional(),
  linkedin: z.string().url({ message: "رابط LinkedIn غير صالح." }).optional().or(z.literal('')),
  summary: z.string().min(50, { message: "الملخص يجب أن يكون 50 حرفًا على الأقل." }),
  experience: z.string().min(50, { message: "الخبرة يجب أن تكون 50 حرفًا على الأقل." }),
  education: z.string().min(50, { message: "التعليم يجب أن يكون 50 حرفًا على الأقل." }),
  skills: z.string().min(10, { message: "المهارات مطلوبة." }),
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

interface ResumeFormProps {
  form: ReturnType<typeof useForm<ResumeFormValues>>;
  onSubmit: (values: ResumeFormValues) => void;
  buttonText: string;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ form, onSubmit, buttonText }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الكامل</FormLabel>
              <FormControl>
                <Input placeholder="مثال: أحمد محمد" {...field} />
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
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@domain.com" {...field} />
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
              <FormLabel>رقم الهاتف (اختياري)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+966 50 123 4567" {...field} />
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
              <FormLabel>رابط LinkedIn (اختياري)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.linkedin.com/in/yourprofile" {...field} />
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
              <FormLabel>ملخص احترافي</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="اكتب ملخصًا موجزًا عن خبراتك وأهدافك المهنية..."
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
              <FormLabel>الخبرة العملية</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="اذكر خبراتك العملية، بدءًا من الأحدث. (الشركة، المسمى الوظيفي، التواريخ، المسؤوليات والإنجازات)..."
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
              <FormLabel>التعليم</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="اذكر مؤهلاتك التعليمية. (الجامعة، التخصص، الدرجة، التواريخ)..."
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
              <FormLabel>المهارات</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="اذكر مهاراتك الأساسية، مفصولة بفاصلة. (مثال: إدارة المشاريع، التسويق الرقمي، تحليل البيانات)..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">{buttonText}</Button>
      </form>
    </Form>
  );
};

export default ResumeForm;