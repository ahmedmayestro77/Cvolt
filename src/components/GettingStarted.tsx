import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, Wand2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GettingStarted = () => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t('gettingStarted.step1.title', 'Create Your First Resume'),
      description: t('gettingStarted.step1.description', 'Choose a template and fill in your details. Our AI can help you write it!'),
      cta: t('gettingStarted.step1.cta', 'Create Resume'),
      link: '/templates',
      icon: <FilePlus className="h-8 w-8 text-primary" />,
    },
    {
      title: t('gettingStarted.step2.title', 'Generate a Cover Letter'),
      description: t('gettingStarted.step2.description', 'Let our AI write a tailored cover letter for your dream job in seconds.'),
      cta: t('gettingStarted.step2.cta', 'Generate Cover Letter'),
      link: '/cover-letter/create',
      icon: <Wand2 className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('gettingStarted.title', 'Welcome! Let\'s Get Started')}</CardTitle>
        <CardDescription>{t('gettingStarted.description', 'Follow these steps to land your next job.')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              {step.icon}
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <Link to={step.link}>
              <Button variant="ghost" size="sm">
                {step.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GettingStarted;