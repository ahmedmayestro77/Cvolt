import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Resume, useResumes } from '@/hooks/use-resumes';
import { useProfile } from '@/hooks/use-profile';
import ResumePreview from './ResumePreview';
import { templates, Template } from '@/data/templates';

interface TemplateSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
}

const TemplateSwitcherModal: React.FC<TemplateSwitcherModalProps> = ({ isOpen, onClose, resume }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { useUpdateResume } = useResumes();
  const updateResumeMutation = useUpdateResume();

  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState(resume.template_slug);

  const handleSave = () => {
    const selectedTemplate = templates.find(t => t.slug === selectedTemplateSlug);
    if (!selectedTemplate) return;

    if (selectedTemplate.isPro && profile?.subscription_status !== 'pro') {
      navigate('/pricing');
      return;
    }

    updateResumeMutation.mutate(
      { id: resume.id, updatedValues: resume, templateSlug: selectedTemplateSlug },
      { onSuccess: onClose }
    );
  };

  const isProUser = profile?.subscription_status === 'pro';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('templateSwitcher.title')}</DialogTitle>
          <DialogDescription>{t('templateSwitcher.description')}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-hidden">
          <ScrollArea className="md:col-span-1 h-full">
            <div className="space-y-4 pr-4">
              {templates.map((template) => {
                const isSelected = selectedTemplateSlug === template.slug;
                const canUse = !template.isPro || isProUser;
                return (
                  <Card
                    key={template.slug}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected && "border-primary ring-2 ring-primary",
                      !canUse && "opacity-60"
                    )}
                    onClick={() => setSelectedTemplateSlug(template.slug)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={template.imageUrl} alt={template.name} className="w-16 h-20 object-cover rounded-sm border" />
                          <div>
                            <h4 className="font-semibold">{t(`templates.${template.slug}.name`, template.name)}</h4>
                            {template.isPro && <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 text-xs">Pro</Badge>}
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-6 w-6 text-primary" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
          <div className="md:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex justify-center">
                <ResumePreview resume={resume} templateSlug={selectedTemplateSlug} />
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} disabled={updateResumeMutation.isPending}>
            {updateResumeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSwitcherModal;