import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccess, showError } from '@/utils/toast';
import { useResumeStore } from '@/hooks/use-resume-store';
import { useNavigate } from 'react-router-dom';
import ResumeForm, { resumeFormSchema, ResumeFormValues } from '@/components/ResumeForm';

const CreateResume = () => {
  const { addResume } = useResumeStore();
  const navigate = useNavigate();

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
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

  const onSubmit = (values: ResumeFormValues) => {
    try {
      addResume(values);
      showSuccess("تم إنشاء السيرة الذاتية بنجاح!");
      navigate('/my-resumes');
    } catch (error) {
      console.error("Failed to create resume:", error);
      showError("فشل في إنشاء السيرة الذاتية. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">إنشاء سيرة ذاتية جديدة</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        املأ المعلومات التالية لإنشاء سيرتك الذاتية.
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>معلوماتك الشخصية</CardTitle>
          <CardDescription>ابدأ بملء التفاصيل الأساسية.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeForm
            form={form}
            onSubmit={onSubmit}
            buttonText="إنشاء السيرة الذاتية"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateResume;