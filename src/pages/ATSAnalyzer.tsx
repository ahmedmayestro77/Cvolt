import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileSearch, UploadCloud, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ATSAnalyzer = () => {
  const { t } = useTranslation();

  const tips = [
    t('ats.tipsCard.tip1'),
    t('ats.tipsCard.tip2'),
    t('ats.tipsCard.tip3'),
    t('ats.tipsCard.tip4'),
    t('ats.tipsCard.tip5'),
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('ats.title')}</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        {t('ats.description')}
      </p>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            {t('ats.uploadCard.title')}
          </CardTitle>
          <CardDescription>{t('ats.uploadCard.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('ats.uploadCard.placeholder')}
            className="min-h-[200px]"
          />
          <Button className="w-full">
            <FileSearch className="h-4 w-4 mr-2" /> {t('ats.uploadCard.button')}
          </Button>
        </CardContent>
      </Card>

      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            {t('ats.tipsCard.title')}
          </CardTitle>
          <CardDescription>{t('ats.tipsCard.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATSAnalyzer;