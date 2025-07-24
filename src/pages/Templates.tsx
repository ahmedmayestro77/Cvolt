import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { showError } from '@/utils/toast';

interface TemplateCardProps {
  name: string;
  description: string;
  isPro: boolean;
  imageUrl: string;
  slug: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ name, description, isPro, imageUrl, slug }) => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const handleUseTemplate = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      showError("Please log in to use a template.");
      navigate('/auth');
      return;
    }
    if (isPro && profile?.subscription_status !== 'pro') {
      e.preventDefault();
      showError("This is a Pro template. Please upgrade to use it.");
      navigate('/pricing');
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        <img src={imageUrl} alt={`Template ${name}`} className="w-full h-full object-cover object-top" />
        {isPro && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-yellow-400 text-yellow-900">
            {t('templates.proBadge')}
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-end">
        <Link to={`/create?template=${slug}`} onClick={handleUseTemplate} className="w-full">
          <Button className="w-full">
            {t('templates.useButton')} <ArrowRight className="mx-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const Templates = () => {
  const { t } = useTranslation();

  const templates = [
    { slug: 'modern-minimalist', name: t('templates.modernMinimalist.name'), description: t('templates.modernMinimalist.description'), isPro: false, imageUrl: '/assets/images/template-modern-minimalist.png' },
    { slug: 'professional-classic', name: t('templates.professionalClassic.name'), description: t('templates.professionalClassic.description'), isPro: false, imageUrl: '/assets/images/template-professional-classic.png' },
    { slug: 'creative-portfolio', name: t('templates.creativePortfolio.name'), description: t('templates.creativePortfolio.description'), isPro: true, imageUrl: '/assets/images/template-creative-portfolio.png' },
    { slug: 'tech-savvy', name: t('templates.techSavvy.name'), description: t('templates.techSavvy.description'), isPro: true, imageUrl: '/assets/images/template-tech-savvy.png' },
    { slug: 'academic-research', name: t('templates.academicResearch.name'), description: t('templates.academicResearch.description'), isPro: true, imageUrl: '/assets/images/template-academic-research.png' },
    { slug: 'executive-summary', name: t('templates.executiveSummary.name'), description: t('templates.executiveSummary.description'), isPro: true, imageUrl: '/assets/images/template-executive-summary.png' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('templates.title')}</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">{t('templates.description')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard key={template.slug} {...template} />
        ))}
      </div>
      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('templates.proUpsell.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('templates.proUpsell.description')}</p>
        <Link to="/pricing">
          <Button size="lg">{t('templates.proUpsell.cta')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Templates;