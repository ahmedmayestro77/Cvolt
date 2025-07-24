import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, LayoutTemplate, FileText, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('dashboard.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              {t('dashboard.create')}
            </CardTitle>
            <CardDescription>{t('dashboard.createDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/create">
              <Button className="w-full">{t('dashboard.startNow')}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-primary" />
              {t('dashboard.browseTemplates')}
            </CardTitle>
            <CardDescription>{t('dashboard.browseTemplatesDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/templates">
              <Button variant="outline" className="w-full">{t('dashboard.viewTemplates')}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('dashboard.myResumes')}
            </CardTitle>
            <CardDescription>{t('dashboard.myResumesDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/my-resumes">
              <Button variant="outline" className="w-full">{t('dashboard.viewResumes')}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              {t('dashboard.atsAnalyzer')}
            </CardTitle>
            <CardDescription>{t('dashboard.atsAnalyzerDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/ats-analyzer">
              <Button variant="outline" className="w-full">{t('dashboard.analyzeNow')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;