import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { showSuccess, showError } from '@/utils/toast';

interface PricingCardProps {
  title: string;
  price: string;
  frequency: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  isCurrentPlan?: boolean;
  onSubscribe?: () => void;
  isSubscribing?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title, price, frequency, features, isPopular = false, buttonText,
  buttonVariant = "default", isCurrentPlan, onSubscribe, isSubscribing
}) => {
  const { t } = useTranslation();
  return (
    <Card className={`flex flex-col ${isPopular ? 'border-2 border-primary shadow-lg' : ''}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {isPopular && <CardDescription className="text-primary font-semibold">{t('pricing.pro.popular')}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center py-6">
        <div className="text-5xl font-extrabold mb-2">{price}</div>
        <div className="text-lg text-gray-500 dark:text-gray-400 mb-6">{frequency}</div>
        <ul className="space-y-3 text-left w-full px-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-6">
        <Button className="w-full" variant={buttonVariant} onClick={onSubscribe} disabled={isCurrentPlan || isSubscribing}>
          {isSubscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isCurrentPlan ? "Current Plan" : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const { t } = useTranslation();
  const { session, user, supabase, profile, refetchProfile } = useAuth();
  const navigate = useNavigate();
  const [isSubscribing, setIsSubscribing] = React.useState(false);

  const handleSubscribe = async () => {
    if (!session) {
      navigate('/auth');
      return;
    }
    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'pro' })
        .eq('id', user!.id);
      if (error) throw error;
      await refetchProfile();
      showSuccess("Successfully upgraded to Pro!");
      navigate('/dashboard');
    } catch (error) {
      showError("Failed to upgrade. Please try again.");
      console.error(error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const pricingTiers = [
    {
      title: t('pricing.free.title'),
      price: t('pricing.free.price'),
      frequency: t('pricing.free.frequency'),
      features: t('pricing.free.features', { returnObjects: true }) as string[],
      buttonText: t('pricing.free.button'),
      buttonVariant: 'outline' as const,
      isCurrentPlan: profile?.subscription_status === 'free',
    },
    {
      title: t('pricing.pro.title'),
      price: t('pricing.pro.price'),
      frequency: t('pricing.pro.frequency'),
      features: t('pricing.pro.features', { returnObjects: true }) as string[],
      isPopular: true,
      buttonText: t('pricing.pro.button'),
      isCurrentPlan: profile?.subscription_status === 'pro',
      onSubscribe: handleSubscribe,
      isSubscribing: isSubscribing,
    },
    {
      title: t('pricing.enterprise.title'),
      price: t('pricing.enterprise.price'),
      frequency: t('pricing.enterprise.frequency'),
      features: t('pricing.enterprise.features', { returnObjects: true }) as string[],
      buttonText: t('pricing.enterprise.button'),
      buttonVariant: 'outline' as const,
      onSubscribe: () => navigate('/contact'),
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('pricing.title')}</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('pricing.description')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <PricingCard key={index} {...tier} />
        ))}
      </div>
      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('pricing.questions.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('pricing.questions.description')}</p>
        <Link to="/contact">
          <Button size="lg" variant="outline">{t('pricing.questions.button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Pricing;