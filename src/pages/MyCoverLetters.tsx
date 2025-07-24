import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Edit, Trash2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCoverLetters, CoverLetter } from '@/hooks/use-cover-letters';
import { useTranslation } from 'react-i18next';

interface CoverLetterItemProps {
  coverLetter: CoverLetter;
  onDelete: (id: string) => void;
}

const CoverLetterItem: React.FC<CoverLetterItemProps> = ({ coverLetter, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col md:flex-row items-center justify-between p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4 md:mb-0 text-center md:text-left">
        <FileSignature className="h-8 w-8 text-primary flex-shrink-0" />
        <div>
          <CardTitle className="text-lg">{coverLetter.job_title}</CardTitle>
          <CardDescription className="text-sm">
            {t('myCoverLetters.forCompany', { company: coverLetter.company_name || 'N/A' })} - {t('myResumes.lastModified', { date: new Date(coverLetter.last_modified).toLocaleDateString() })}
          </CardDescription>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to={`/cover-letter/edit/${coverLetter.id}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" /> {t('myResumes.edit')}
          </Button>
        </Link>
        <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={() => onDelete(coverLetter.id)}>
          <Trash2 className="h-4 w-4" /> {t('myResumes.delete')}
        </Button>
      </div>
    </Card>
  );
};

const MyCoverLetters = () => {
  const { t } = useTranslation();
  const { useGetCoverLetters, useDeleteCoverLetter } = useCoverLetters();
  const { data: coverLetters, isLoading } = useGetCoverLetters();
  const deleteCoverLetterMutation = useDeleteCoverLetter();

  const handleDelete = (id: string) => {
    if (window.confirm(t('myCoverLetters.deleteConfirm'))) {
      deleteCoverLetterMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('myCoverLetters.title')}</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        {t('myCoverLetters.description')}
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !coverLetters || coverLetters.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            {t('myCoverLetters.noCoverLetters')}
          </p>
          <Link to="/cover-letter/create">
            <Button size="lg">{t('myCoverLetters.createFirst')}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {coverLetters.map((cl) => (
            <CoverLetterItem
              key={cl.id}
              coverLetter={cl}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {t('myCoverLetters.createNew')}
        </h2>
        <Link to="/cover-letter/create">
          <Button size="lg">{t('myCoverLetters.createNewButton')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default MyCoverLetters;