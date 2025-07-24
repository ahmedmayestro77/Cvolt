import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit, Download, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ResumeItemProps {
  id: string;
  title: string;
  lastModified: string;
}

const ResumeItem: React.FC<ResumeItemProps> = ({ id, title, lastModified }) => (
  <Card className="flex flex-col md:flex-row items-center justify-between p-4 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-4 mb-4 md:mb-0">
      <FileText className="h-8 w-8 text-primary" />
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">آخر تعديل: {lastModified}</CardDescription>
      </div>
    </div>
    <div className="flex flex-wrap justify-center gap-2">
      <Link to={`/edit-resume/${id}`}>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-4 w-4" /> تعديل
        </Button>
      </Link>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Download className="h-4 w-4" /> تحميل
      </Button>
      <Button variant="destructive" size="sm" className="flex items-center gap-1">
        <Trash2 className="h-4 w-4" /> حذف
      </Button>
    </div>
  </Card>
);

const MyResumes = () => {
  // Dummy data for demonstration
  const resumes = [
    { id: '1', title: 'سيرة ذاتية للمهندس البرمجي', lastModified: '2023-10-26' },
    { id: '2', title: 'سيرة ذاتية لمدير التسويق', lastModified: '2023-09-15' },
    { id: '3', title: 'سيرة ذاتية لمحلل البيانات', lastModified: '2023-08-01' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">سيرتي الذاتية</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        هنا يمكنك إدارة جميع سيرك الذاتية التي قمت بإنشائها.
      </p>

      {resumes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            لم تقم بإنشاء أي سيرة ذاتية بعد.
          </p>
          <Link to="/create">
            <Button size="lg">ابدأ بإنشاء سيرة ذاتية جديدة</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <ResumeItem key={resume.id} {...resume} />
          ))}
        </div>
      )}

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          هل تحتاج إلى إنشاء سيرة ذاتية جديدة؟
        </h2>
        <Link to="/create">
          <Button size="lg">إنشاء سيرة ذاتية جديدة</Button>
        </Link>
      </div>
    </div>
  );
};

export default MyResumes;