import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Edit, FileText, Sparkles, MoveRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ParticlesBackground from "@/components/ParticlesBackground";
import { testimonials } from "../data/testimonials";

const Index = () => {
  const { t, ready } = useTranslation();

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (!ready) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 text-center">
        <ParticlesBackground />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/50 dark:from-blue-950/50 to-white dark:to-gray-950"></div>
        
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            {t('index.title.part1')}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
              {t('index.title.part2')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            {t('index.subtitle')}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/templates">
              <Button size="lg" className="px-10 py-7 text-lg w-full sm:w-auto group">
                {t('index.ctaPrimary')} <MoveRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Showcase Section */}
      <section className="py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="container mx-auto px-4"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl shadow-primary/10 p-4 md:p-8 border border-primary/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <img src="/assets/images/cvolt-showcase.png" alt="CVOLT App Showcase" className="rounded-lg w-full h-auto" />
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold">{t('index.steps.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">{t('index.steps.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FileText className="h-10 w-10 text-primary" />, title: t('index.steps.choose.title'), description: t('index.steps.choose.description') },
              { icon: <Edit className="h-10 w-10 text-primary" />, title: t('index.steps.fill.title'), description: t('index.steps.fill.description') },
              { icon: <Sparkles className="h-10 w-10 text-primary" />, title: t('index.steps.download.title'), description: t('index.steps.download.description') },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="flex justify-center items-center mb-6 h-20 w-20 rounded-full bg-primary/10 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">{t('testimonials.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardContent className="pt-6 flex-grow">
                    <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                  </CardContent>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{testimonial.name}</CardTitle>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('index.finalCta.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('index.finalCta.subtitle')}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/templates">
                <Button size="lg" className="px-10 py-7 text-lg w-full sm:w-auto group">
                  {t('index.ctaPrimary')} <MoveRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default Index;