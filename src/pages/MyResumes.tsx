import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, PlusCircle } from 'lucide-react';
import { useResumes, Resume } from '@/hooks/use-resumes';
import { useTranslation } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResumePreview from '@/components/ResumePreview';
import { showError } from '@/utils/toast';
import TemplateSwitcherModal from '@/components/TemplateSwitcherModal';
import ResumeCard from '@/components/ResumeCard';

const MyResumes = () => {
  const { t } = useTranslation();
  const { useGetResumes, useDeleteResume } = useResumes();
  const { data: resumes, isLoading } = useGetResumes();
  const deleteResumeMutation = useDeleteResume();
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(null);
  
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm(t('myResumes.deleteConfirm'))) {
      deleteResumeMutation.mutate(id);
    }
  };

  const handleOpenTemplateSwitcher = (resume: Resume) => {
    setSelectedResume(resume);
    setIsSwitcherOpen(true);
  };

  const handleDownload = async (resume: Resume) => {
    setIsDownloading(true);
    setCurrentDownloadId(resume.id);
    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);

      const root = createRoot(tempContainer);
      root.render(<ResumePreview resume={resume} templateSlug={resume.template_slug} />);

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, { scale: 2 });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV_${resume.fullName.replace(/\s/g, '_')}.pdf`);

      root.unmount();
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      showError(t('myResumes.downloadError'));
    } finally {
      setIsDownloading(false);
      setCurrentDownloadId(null);
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">{t('myResumes.title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
              {t('myResumes.description')}
            </p>
          </div>
          <Link to="/create">
            <Button size="lg" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              {t('myResumes.createNew')}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !resumes || resumes.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">{t('myResumes.noResumes')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('myResumes.getStarted', 'Get started by creating a new resume.')}</p>
            <div className="mt-6">
              <Link to="/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('myResumes.createFirst')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onOpenTemplateSwitcher={handleOpenTemplateSwitcher}
                isDownloading={isDownloading}
                currentDownloadId={currentDownloadId}
              />
            ))}
          </div>
        )}
      </div>
      {selectedResume && (
        <TemplateSwitcherModal
          isOpen={isSwitcherOpen}
          onClose={() => setIsSwitcherOpen(false)}
          resume={selectedResume}
        />
      )}
    </>
  );
};

export default MyResumes;