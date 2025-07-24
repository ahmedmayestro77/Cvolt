import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit, Download, Trash2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useResumes, Resume } from '@/hooks/use-resumes';
import { showSuccess, showError } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResumePreview from '@/components/ResumePreview';

interface ResumeItemProps {
  resume: Resume;
  onDelete: (id: string) => void;
  onDownload: (resume: Resume) => void;
}

const ResumeItem: React.FC<ResumeItemProps> = ({ resume, onDelete, onDownload }) => {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col md:flex-row items-center justify-between p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4 md:mb-0 text-center md:text-left">
        <FileText className="h-8 w-8 text-primary flex-shrink-0" />
        <div>
          <CardTitle className="text-lg">{resume.fullName}'s Resume</CardTitle>
          <CardDescription className="text-sm">{t('myResumes.lastModified', { date: new Date(resume.last_modified).toLocaleDateString() })}</CardDescription>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to={`/edit-resume/${resume.id}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" /> {t('myResumes.edit')}
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => onDownload(resume)}>
          <Download className="h-4 w-4" /> {t('myResumes.download')}
        </Button>
        <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={() => onDelete(resume.id)}>
          <Trash2 className="h-4 w-4" /> {t('myResumes.delete')}
        </Button>
      </div>
    </Card>
  );
};

const MyResumes = () => {
  const { t } = useTranslation();
  const { resumes, deleteResume, loading } = useResumes();

  const handleDelete = async (id: string) => {
    if (window.confirm(t('myResumes.deleteConfirm'))) {
      try {
        await deleteResume(id);
        showSuccess(t('myResumes.deleteSuccess'));
      } catch (error) {
        console.error("Failed to delete resume:", error);
        showError(t('myResumes.deleteError'));
      }
    }
  };

  const handleDownload = async (resume: Resume) => {
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);

    const root = createRoot(tempContainer);
    root.render(<ResumePreview resume={resume} />);

    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, { scale: 2 });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    const width = pdfWidth;
    const height = width / ratio;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfHeight : height);
    pdf.save(`CV_${resume.fullName.replace(/\s/g, '_')}.pdf`);

    root.unmount();
    document.body.removeChild(tempContainer);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('myResumes.title')}</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        {t('myResumes.description')}
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            {t('myResumes.noResumes')}
          </p>
          <Link to="/create">
            <Button size="lg">{t('myResumes.createFirst')}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <ResumeItem key={resume.id} resume={resume} onDelete={handleDelete} onDownload={handleDownload} />
          ))}
        </div>
      )}

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {t('myResumes.createNew')}
        </h2>
        <Link to="/create">
          <Button size="lg">{t('myResumes.createNew')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default MyResumes;