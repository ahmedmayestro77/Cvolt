import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { showSuccess, showError } from '@/utils/toast';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface GeoPrice {
  price: string;
  currency: string;
  currencySymbol: string;
  priceId: string;
}

interface PricingCardProps {
  title: string;
  price?: string;
  frequency: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  isCurrentPlan?: boolean;
  onSubscribe?: () => void;
  isSubscribing?: boolean;
  isLoadingPrice?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title, price, frequency, features, isPopular = false, buttonText,
  buttonVariant = "default", isCurrentPlan, onSubscribe, isSubscribing, isLoadingPrice
}) => {
  return (
    <Card className={`flex flex-col ${isPopular ? 'border-2 border-primary shadow-lg' : ''}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {isPopular && <CardDescription className="text-primary font-semibold">Most Popular</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center py-6">
        {isLoadingPrice ? (
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        ) : (
          <>
            <div className="text-5xl font-extrabold mb-2">{price}</div>
            <div className="text-lg text-gray-500 dark:text-gray-400 mb-6">{frequency}</div>
          </>
        )}
        <ul className="space-y-3 text-left w-full px-4 mt-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-6">
        <Button className="w-full" variant={buttonVariant} onClick={onSubscribe} disabled={isCurrentPlan || isSubscribing || isLoadingPrice}>
          {isSubscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isCurrentPlan ? "Current Plan" : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const { t } = useTranslation();
  const { session, supabase, profile } = useAuth();
  const navigate = useNavigate();
  const [isSubscribing, setIsSubscribing] = React.useState(false);

  const { data: geoPrice, isLoading: isLoadingGeoPrice } = useQuery<GeoPrice, Error>({
    queryKey: ['geo-price'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-geo-price');
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1,
  });

  const handleSubscribe = async () => {
    if (!session) {
      navigate('/auth');
      return;
    }
    if (!geoPrice?.priceId) {
      showError("Could not determine pricing for your region. Please try again later.");
      return;
    }

    setIsSubscribing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId: geoPrice.priceId },
      });
      
      if (error) throw new Error(`Function error: ${error.message}`);
      if (data.error) throw new Error(`Checkout error: ${data.error}`);
      if (!data.checkoutUrl) throw new Error("No checkout URL returned.");

      window.location.href = data.checkoutUrl;

    } catch (error) {
      console.error(error);
      showError("Failed to start subscription. Please try again.");
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
      onSubscribe: () => navigate('/auth'),
    },
    {
      title: t('pricing.pro.title'),
      price: geoPrice ? `${geoPrice.currencySymbol}${geoPrice.price}` : '$9',
      frequency: t('pricing.pro.frequency'),
      features: t('pricing.pro.features', { returnObjects: true }) as string[],
      isPopular: true,
      buttonText: t('pricing.pro.button'),
      isCurrentPlan: profile?.subscription_status === 'pro',
      onSubscribe: handleSubscribe,
      isSubscribing: isSubscribing,
      isLoadingPrice: isLoadingGeoPrice,
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