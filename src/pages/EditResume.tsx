import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccess, showError } from '@/utils/toast';
import { useResumeStore, Resume } from '@/hooks/use-resume-store';
import { useNavigate, useParams } from 'react-router-dom';
import ResumeForm, { resumeFormSchema, ResumeFormValues } from '@/components/ResumeForm';

const EditResume = () => {
  const { id } = useParams<{ id: string }>();
  const { getResumeById, updateResume } = useResumeStore();
  const navigate = useNavigate();

  const resumeToEdit = id ? getResumeById(id) : undefined;

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
          <ResumeForm
            form={form}
            onSubmit={onSubmit}
            buttonText="حفظ التغييرات"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditResume;