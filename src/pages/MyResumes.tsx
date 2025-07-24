import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit, Download, Trash2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Resume {
  id: string;
  title: string;
  lastModified: string;
  template: string;
}

const mockResumes: Resume[] = [
  { id: '1', title: 'سيرة ذاتية - مدير مشروع', lastModified: '2023-10-26', template: 'Modern Minimalist' },
  { id: '2', title: 'سيرة ذاتية - مطور برمجيات', lastModified: '2023-10-20', template: 'Professional Classic' },
  { id: '3', title: 'سيرة ذاتية - مصمم جرافيك', lastModified: '2023-09-15', template: 'Creative Portfolio' },
  { id: '4', title: 'سيرة ذاتية - محلل بيانات', lastModified: '2023-08-01', template: 'Tech Savvy' },
];

const MyResumes = () => {
  const handleEdit = (id: string) => {
    showSuccess(`تعديل السيرة الذاتية رقم: ${id}`);
    // In a real app, navigate to an edit page: navigate(`/edit-resume/${id}`);
  };

  const handleDownload = (id: string) => {
    showSuccess(`تنزيل السيرة الذاتية رقم: ${id}`);
    // Logic to trigger PDF download or similar
  };

  const handleDelete = (id: string) => {
    showSuccess(`حذف السيرة الذاتية رقم: ${id}`);
    // Logic to delete the resume from state/backend
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">سيرتي الذاتية</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        هنا يمكنك إدارة جميع سيرك الذاتية التي قمت بإنشائها.
      </p>

      {mockResumes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
            لم تقم بإنشاء أي سيرة ذاتية بعد.
          </p>
          <Link to="/create">
            <Button size="lg">ابدأ بإنشاء سيرة ذاتية جديدة</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockResumes.map((resume) => (
            <Card key={resume.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {resume.title}
                </CardTitle>
                <CardDescription>
                  آخر تعديل: {resume.lastModified} | القالب: {resume.template}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end gap-2">
                <Button variant="outline" className="w-full" onClick={() => handleEdit(resume.id)}>
                  <Edit className="mr-2 h-4 w-4" /> تعديل
                </Button>
                <Button className="w-full" onClick={() => handleDownload(resume.id)}>
                  <Download className="mr-2 h-4 w-4" /> تنزيل
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => handleDelete(resume.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> حذف
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResumes;