import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileSearch, Loader2, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { showError } from '@/utils/toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchCount: number;
  jobKeywordCount: number;
}

const ATSAnalyzer = () => {
  const { t } = useTranslation();
  const { supabase } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      showError(t('ats.validation.bothRequired'));
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume-for-ats', {
        body: { resumeText, jobDescription },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error(err);
      showError(t('ats.validation.analysisFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('ats.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t('ats.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('ats.resumeInput.title')}</CardTitle>
            <CardDescription>{t('ats.resumeInput.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t('ats.resumeInput.placeholder')}
              className="min-h-[300px]"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ats.jobInput.title')}</CardTitle>
            <CardDescription>{t('ats.jobInput.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t('ats.jobInput.placeholder')}
              className="min-h-[300px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('ats.analyzingButton')}
            </>
          ) : (
            <>
              <FileSearch className="mr-2 h-4 w-4" /> {t('ats.analyzeButton')}
            </>
          )}
        </Button>
      </div>

      {result && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('ats.results.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">{t('ats.results.matchScore')}</p>
              <div className="relative h-24 w-24 mx-auto">
                <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray={`${result.score}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{result.score}%</span>
                </div>
              </div>
              <p className="text-muted-foreground">{t('ats.results.matchCount', { count: result.matchCount, total: result.jobKeywordCount })}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">{t('ats.results.matchedKeywords')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-lg">{t('ats.results.missingKeywords')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map(kw => <Badge key={kw} variant="destructive">{kw}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ATSAnalyzer;