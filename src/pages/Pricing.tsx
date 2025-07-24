import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  frequency: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  frequency,
  features,
  isPopular = false,
  buttonText,
  buttonVariant = "default",
}) => (
  <Card className={`flex flex-col ${isPopular ? 'border-2 border-primary shadow-lg' : ''}`}>
    <CardHeader className="text-center pb-4">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-300">
        {isPopular && <span className="text-primary font-semibold">الأكثر شعبية</span>}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col items-center justify-center py-6">
      <div className="text-5xl font-extrabold mb-2">
        {price}
      </div>
      <div className="text-lg text-gray-500 dark:text-gray-400 mb-6">
        {frequency}
      </div>
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
      <Button className="w-full" variant={buttonVariant}>
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
);

const Pricing = () => {
  const pricingTiers = [
    {
      title: 'مجاني',
      price: '0 ر.س',
      frequency: 'شهريًا',
      features: [
        'إنشاء سيرة ذاتية واحدة',
        'قوالب أساسية',
        'تحميل PDF',
        'دعم محدود',
      ],
      buttonText: 'ابدأ مجانًا',
      buttonVariant: 'outline' as const,
    },
    {
      title: 'Pro',
      price: '49 ر.س',
      frequency: 'شهريًا',
      features: [
        'عدد غير محدود من السير الذاتية',
        'جميع القوالب الاحترافية',
        'تحليل ATS متقدم',
        'تتبع طلبات الوظائف',
        'دعم ذو أولوية',
      ],
      isPopular: true,
      buttonText: 'اشترك الآن',
    },
    {
      title: 'Enterprise',
      price: 'اتصل بنا',
      frequency: 'للمؤسسات',
      features: [
        'جميع ميزات Pro',
        'حلول مخصصة للشركات',
        'إدارة فريق العمل',
        'دعم مخصص 24/7',
        'تدريب مخصص',
      ],
      buttonText: 'تواصل معنا',
      buttonVariant: 'outline' as const,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">خطط الأسعار لدينا</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          اختر الخطة التي تناسب احتياجاتك، سواء كنت تبدأ للتو أو تبحث عن حلول متقدمة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <PricingCard key={index} {...tier} />
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          هل لديك أسئلة؟
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          لا تتردد في التواصل معنا إذا كان لديك أي استفسارات حول خططنا.
        </p>
        <Link to="/contact"> {/* Assuming a contact page might be added later */}
          <Button size="lg" variant="outline">تواصل معنا</Button>
        </Link>
      </div>
    </div>
  );
};

export default Pricing;