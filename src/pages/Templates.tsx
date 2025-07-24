import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  name: string;
  description: string;
  isPro: boolean;
  imageUrl: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ name, description, isPro, imageUrl }) => (
  <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
      <img src={imageUrl} alt={`Template ${name}`} className="w-full h-full object-cover" />
      {isPro && (
        <Badge variant="secondary" className="absolute top-3 right-3 bg-yellow-400 text-yellow-900">
          Pro
        </Badge>
      )}
    </div>
    <CardHeader>
      <CardTitle>{name}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex items-end">
      <Link to={`/create?template=${name.toLowerCase().replace(/\s/g, '-')}`} className="w-full">
        <Button className="w-full">
          استخدم هذا القالب <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const Templates = () => {
  const templates = [
    { name: 'Modern Minimalist', description: 'تصميم نظيف وعصري يركز على المحتوى.', isPro: false, imageUrl: 'https://via.placeholder.com/300x200?text=Modern+Minimalist' },
    { name: 'Professional Classic', description: 'تصميم تقليدي واحترافي يناسب جميع الصناعات.', isPro: false, imageUrl: 'https://via.placeholder.com/300x200?text=Professional+Classic' },
    { name: 'Creative Portfolio', description: 'مثالي للمصممين والفنانين لعرض أعمالهم.', isPro: true, imageUrl: 'https://via.placeholder.com/300x200?text=Creative+Portfolio' },
    { name: 'Tech Savvy', description: 'تصميم يبرز المهارات التقنية والخبرة في التكنولوجيا.', isPro: true, imageUrl: 'https://via.placeholder.com/300x200?text=Tech+Savvy' },
    { name: 'Academic Research', description: 'منظم للباحثين والأكاديميين.', isPro: true, imageUrl: 'https://via.placeholder.com/300x200?text=Academic+Research' },
    { name: 'Executive Summary', description: 'ملخص تنفيذي موجز ومؤثر.', isPro: true, imageUrl: 'https://via.placeholder.com/300x200?text=Executive+Summary' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">تصفح القوالب</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
        اختر القالب الذي يناسب أسلوبك ومجال عملك.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <TemplateCard key={index} {...template} />
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          هل تريد المزيد من القوالب الاحترافية؟
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          قم بالترقية إلى اشتراك Pro للوصول إلى أكثر من 20 قالبًا حصريًا وميزات متقدمة!
        </p>
        <Link to="/pricing">
          <Button size="lg">اكتشف خطط Pro</Button>
        </Link>
      </div>
    </div>
  );
};

export default Templates;