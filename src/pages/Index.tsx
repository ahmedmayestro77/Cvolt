import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Edit, FileText, Sparkles, BarChart } from "lucide-react";

const Index = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Edit className="h-8 w-8 text-primary" />,
      title: t('index.features.easy.title'),
      description: t('index.features.easy.description'),
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: t('index.features.templates.title'),
      description: t('index.features.templates.description'),
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: t('index.features.ats.title'),
      description: t('index.features.ats.description'),
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: t('index.features.ai.title'),
      description: t('index.features.ai.description'),
    },
  ];

  const steps = [
    {
      number: "01",
      title: t('index.steps.choose.title'),
      description: t('index.steps.choose.description'),
    },
    {
      number: "02",
      title: t('index.steps.fill.title'),
      description: t('index.steps.fill.description'),
    },
    {
      number: "03",
      title: t('index.steps.download.title'),
      description: t('index.steps.download.description'),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
            {t('index.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            {t('index.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/templates">
              <Button size="lg" className="px-10 py-6 text-lg w-full sm:w-auto">
                {t('index.ctaPrimary')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t('index.features.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">{t('index.features.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center items-center mb-4 h-16 w-16 rounded-full bg-primary/10 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t('index.steps.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">{t('index.steps.subtitle')}</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold z-10">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('index.finalCta.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('index.finalCta.subtitle')}
          </p>
          <Link to="/templates">
            <Button size="lg" className="px-10 py-6 text-lg">
              {t('index.ctaPrimary')}
            </Button>
          </Link>
        </div>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default Index;