import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowRight, FileText, BarChart, Star } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
            {t('dashboard.welcome', { name: userName })}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <Link to="/create">
          <Button size="lg" className="hidden sm:flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            {t('myResumes.createNew')}
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.myResumes')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{resumes?.length || 0}</div>}
            <p className="text-xs text-muted-foreground">{t('dashboard.totalResumes')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.accountStatus')}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.subscription_status || 'Free'}</div>
            {profile?.subscription_status !== 'pro' ? (
              <Link to="/pricing" className="text-xs text-muted-foreground hover:underline">{t('dashboard.upgradeToPro')}</Link>
            ) : (
              <p className="text-xs text-muted-foreground">All features unlocked</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.atsAnalyzer')}</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.subscription_status === 'pro' ? 'Unlocked' : 'Locked'}</div>
            <p className="text-xs text-muted-foreground">Pro feature</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Resumes */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">{t('dashboard.recentResumes')}</h2>
        <Card>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : resumes && resumes.length > 0 ? (
              <div className="space-y-2">
                {resumes.slice(0, 5).map(resume => (
                  <div key={resume.id} className="flex items-center justify-between p-3 hover:bg-secondary rounded-md transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{resume.fullName}'s Resume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground hidden md:block">
                        {t('myResumes.lastModified', { date: new Date(resume.last_modified).toLocaleDateString() })}
                      </span>
                      <Link to={`/edit-resume/${resume.id}`}>
                        <Button variant="outline" size="sm">
                          {t('myResumes.edit')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">{t('myResumes.noResumes')}</p>
                <Link to="/create">
                  <Button>{t('myResumes.createFirst')}</Button>
                </Link>
              </div>
            )}
            {resumes && resumes.length > 5 && (
              <Link to="/my-resumes" className="mt-4 block">
                <Button variant="outline" className="w-full">
                  {t('dashboard.viewAllResumes')}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;