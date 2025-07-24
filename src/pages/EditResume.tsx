import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { showSuccess, showError } from '@/utils/toast';
import { useResumeStore, Resume } from '@/hooks/use-resume-store';
import { useNavigate, useParams } from 'react-router-dom';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "الاسم الكامل مطلوب." }),
  email: z.string().email({ message: "بريد إلكتروني غير صالح." }),
  phone: z.string().optional(),
  linkedin: z.string().url({ message: "رابط LinkedIn غير صالح." }).optional().or(z.literal('')),
  summary: z.string().min(50, { message: "الملخص يجب أن يكون 50 حرفًا على الأقل." }),
  experience: z.string().min(50, { message: "الخبرة يجب أن تكون 50 حرفًا على الأقل." }),
  education: z.string().min(50, { message: "التعليم يجب أن يكون 50 حرفًا على الأقل." }),
  skills: z.string().min(10, { message: "المهارات مطلوبة." }),
});

type ResumeFormValues = z.infer<typeof formSchema>;

const EditResume = () => {
  const { id } = useParams<{ id: string }>();
  const { getResumeById, updateResume } = useResumeStore();
  const navigate = useNavigate();

  const resumeToEdit = id ? getResumeById(id) : undefined;

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      summary: "",
      experience: "",
      education: "",
      skills: "",
    },
  });

  useEffect(() => {
    if (resumeToEdit) {
      form.reset(resumeToEdit);
    } else if (id) {
      showError("لم يتم العثور على السيرة الذاتية.");
      navigate('/my-resumes');
    }
  }, [id, resumeToEdit, form, navigate]);

  const onSubmit = (values: ResumeFormValues) => {
    if (!id) return;
    try {
      const updatedResume: Resume = { ...values, id, lastModified: new Date().toISOString().split('T')[0] };
      updateResume(updatedResume);
      showSuccess("تم تحديث السيرة الذاتية بنجاح!");
      navigate('/my-resumes');
    } catch (error) {
      console.error("Failed to update resume:", error);
      showError("فشل في تحديث السيرة الذاتية. يرجى المحاولة مرة أخرى.");
    }
  };

  if (!resumeToEdit) {
    return (
        <div className="container mx-auto p-6 text-center">
            <p>جاري تحميل السيرة الذاتية...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">تعديل السيرة الذاتية</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        قم بتحديث معلومات سيرتك الذاتية.
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>معلوماتك الشخصية</CardTitle>
          <CardDescription>عدّل التفاصيل حسب الحاجة.</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Button type="submit" className="w-full">حفظ التغييرات</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditResume;