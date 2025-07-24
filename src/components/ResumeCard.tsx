import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Download, Trash2, LayoutTemplate, MoreVertical, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Resume } from '@/hooks/use-resumes';
import { templates } from '@/data/templates';

interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => void;
  onDownload: (resume: Resume) => Promise<void>;
  onOpenTemplateSwitcher: (resume: Resume) => void;
  isDownloading: boolean;
  currentDownloadId: string | null;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onDelete, onDownload, onOpenTemplateSwitcher, isDownloading, currentDownloadId }) => {
  const { t } = useTranslation();
  const template = templates.find(t => t.slug === resume.template_slug);
  const isThisDownloading = isDownloading && currentDownloadId === resume.id;

  return (
    <Card className="flex flex-col group">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="text-lg">{resume.fullName}'s Resume</CardTitle>
          <CardDescription className="text-sm">{t('myResumes.lastModified', { date: new Date(resume.last_modified).toLocaleDateString() })}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('common.actions', 'Actions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/edit-resume/${resume.id}`} className="flex items-center cursor-pointer w-full">
                <Edit className="mr-2 h-4 w-4" /> {t('myResumes.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenTemplateSwitcher(resume)} className="cursor-pointer">
              <LayoutTemplate className="mr-2 h-4 w-4" /> {t('myResumes.changeTemplate')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(resume)} disabled={isThisDownloading} className="cursor-pointer">
              {isThisDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {t('myResumes.download')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(resume.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" /> {t('myResumes.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        <Link to={`/edit-resume/${resume.id}`}>
          <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden border">
            <img
              src={template?.imageUrl || '/assets/images/template-modern-minimalist.png'}
              alt={template?.name || 'Resume template preview'}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </CardContent>
      <CardFooter>
        <Link to={`/edit-resume/${resume.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            {t('myResumes.edit')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ResumeCard;