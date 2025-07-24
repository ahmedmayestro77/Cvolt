import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileSearch, UploadCloud, Lightbulb } from 'lucide-react';

const ATSAnalyzer = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">تحليل ATS و CVOLT-Score</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        حسّن سيرتك الذاتية لتجاوز أنظمة تتبع المتقدمين (ATS) وزد من فرصك في الحصول على مقابلة.
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            تحميل سيرتك الذاتية
          </CardTitle>
          <CardDescription>الصق نص سيرتك الذاتية هنا أو قم بتحميل ملف.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="الصق نص سيرتك الذاتية هنا..."
            className="min-h-[200px]"
          />
          <Button className="w-full">
            <FileSearch className="h-4 w-4 mr-2" /> تحليل السيرة الذاتية
          </Button>
        </CardContent>
      </Card>

      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            نصائح لتحسين ATS
          </CardTitle>
          <CardDescription>تعلم كيف تجعل سيرتك الذاتية صديقة للـ ATS.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>استخدم الكلمات المفتاحية ذات الصلة من الوصف الوظيفي.</li>
            <li>حافظ على تنسيق بسيط وواضح.</li>
            <li>تجنب الرسوم البيانية المعقدة أو الجداول التي قد لا يقرأها الـ ATS.</li>
            <li>استخدم عناوين أقسام قياسية (مثل "الخبرة"، "التعليم"، "المهارات").</li>
            <li>تأكد من خلو السيرة الذاتية من الأخطاء الإملائية والنحوية.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATSAnalyzer;