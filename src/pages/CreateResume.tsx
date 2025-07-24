import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '@/hooks/use-profile';
import { useResumes } from '@/hooks/use-resumes';
import ResumeForm from '@/components/ResumeForm';

const CreateResume = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { useGetResumes } = useResumes();
  const { data: resumes, isLoading: resumesLoading } = useGetResumes();
  const location = useLocation();

  const resumeToEdit = location.state?.resumeToEdit;

  if (resumesLoading || profileLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (profile?.subscription_status === 'free' && resumes && resumes.length >= 1) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="max-w-lg mx-auto mt-10">
          <CardHeader>
            <CardTitle>Free Plan Limit Reached</CardTitle>
            <CardDescription>You can only create one resume on the Free plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Upgrade to Pro to create unlimited resumes and unlock all premium features.</p>
            <Link to="/pricing"><Button><Star className="mr-2 h-4 w-4" /> Upgrade to Pro</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ResumeForm mode="create" resumeToEdit={resumeToEdit} />;
};

export default CreateResume;