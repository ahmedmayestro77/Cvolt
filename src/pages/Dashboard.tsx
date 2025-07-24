import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, LayoutTemplate, BarChart, User, ArrowRight, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { useResumes } from '@/hooks/use-resumes';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { useGetResumes } = useResumes();
  const { data: resumes, isLoading } = useGetResumes();

  const userName = user?.user_metadata?.full_name || user?.email;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          {t('dashboard.welcome', { name: userName })}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <PlusCircle className="h-8 w-8" />
                {t('dashboard.getStarted')}
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {t('dashboard.createDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/create">
                <Button size="lg" variant="secondary" className="w-full md:w-auto">
                  {t('dashboard.startNow')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('dashboard.myResumes')}
              </CardTitle>
              <CardDescription>{t('dashboard.myResumesDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : resumes && resumes.length > 0 ? (
                <div className="space-y-3">
                  {resumes.slice(0, 3).map(resume => (
                    <div key={resume.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                      <div className="font-medium">{resume.fullName}'s Resume</div>
                      <Link to={`/edit-resume/${resume.id}`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t('myResumes.noResumes')}</p>
              )}
              <Link to="/my-resumes" className="mt-4 block">
                <Button variant="outline" className="w-full">
                  {t('dashboard.viewAllResumes')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t('dashboard.accountStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('dashboard.plan')}</span>
                <span className="font-semibold capitalize bg-accent px-2 py-1 rounded-md text-accent-foreground">
                  {profile?.subscription_status || 'Free'}
                </span>
              </div>
              {profile?.subscription_status !== 'pro' && (
                <Link to="/pricing">
                  <Button className="w-full">{t('dashboard.upgradeToPro')}</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                {t('dashboard.browseTemplates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{t('dashboard.browseTemplatesDescription')}</p>
              <Link to="/templates">
                <Button variant="outline" className="w-full">{t('dashboard.viewTemplates')}</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                {t('dashboard.atsAnalyzer')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{t('dashboard.atsAnalyzerDescription')}</p>
              <Link to="/ats-analyzer">
                <Button variant="outline" className="w-full">{t('dashboard.analyzeNow')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;