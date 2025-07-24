import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Star, FileUp, Wand2, FilePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '@/hooks/use-profile';
import { useResumes } from '@/hooks/use-resumes';
import ResumeForm from '@/components/ResumeForm';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';
import AIResumePromptDialog from '@/components/AIResumePromptDialog';
import { ResumeFormValues } from '@/lib/resumeSchema';

const CreateResume = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { useGetResumes } = useResumes();
  const { data: resumes, isLoading: resumesLoading } = useGetResumes();
  const { supabase } = useAuth();
  const location = useLocation();

  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ResumeFormValues | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const resumeToEdit = location.state?.resumeToEdit;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showError('Please upload a PDF file.');
      return;
    }

    setIsParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-resume-from-pdf', {
        body: file,
        headers: { 'Content-Type': 'application/pdf' },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      setParsedData(data);
      setShowForm(true);

    } catch (err) {
      console.error(err);
      showError('Failed to parse resume. Please try again or create it manually.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleShowManualForm = () => {
    setParsedData(null);
    setShowForm(true);
  };

  const handleAiGenerate = (data: ResumeFormValues) => {
    setParsedData(data);
    setShowForm(true);
    setIsAiDialogOpen(false);
  };

  if (showForm) {
    return <ResumeForm mode="create" resumeToEdit={parsedData || resumeToEdit} />;
  }

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

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">How would you like to start?</h1>
          <p className="text-lg text-muted-foreground mt-2">Choose an option below to begin creating your resume.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <FileUp className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle>Upload Existing Resume</CardTitle>
                  <CardDescription>Save time. We'll parse your PDF.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button className="w-full" onClick={() => document.getElementById('resume-upload-input')?.click()} disabled={isParsing}>
                {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                Upload PDF
              </Button>
              <input type="file" id="resume-upload-input" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow flex flex-col border-2 border-primary">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Wand2 className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle>Generate with AI</CardTitle>
                  <CardDescription>Describe your ideal resume and let AI write it.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button className="w-full" onClick={() => setIsAiDialogOpen(true)}>
                <Wand2 className="mr-2 h-4 w-4" />
                Use AI Generator
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <FilePlus className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle>Start from Scratch</CardTitle>
                  <CardDescription>Fill out our easy-to-use form step-by-step.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button className="w-full" variant="outline" onClick={handleShowManualForm}>
                <FilePlus className="mr-2 h-4 w-4" />
                Create Manually
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <AIResumePromptDialog
        isOpen={isAiDialogOpen}
        onClose={() => setIsAiDialogOpen(false)}
        onGenerate={handleAiGenerate}
      />
    </>
  );
};

export default CreateResume;