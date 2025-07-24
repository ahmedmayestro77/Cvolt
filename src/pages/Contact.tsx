import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess } from '@/utils/toast';

const Contact = () => {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here (e.g., API call)
    showSuccess(t('contact.success'));
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('contact.title')}</h1>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
        {t('contact.description')}
      </p>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('contact.title')}</CardTitle>
          <CardDescription>{t('contact.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('contact.form.name')}</Label>
              <Input id="name" placeholder={t('contact.form.namePlaceholder')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('contact.form.email')}</Label>
              <Input id="email" type="email" placeholder={t('contact.form.emailPlaceholder')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t('contact.form.message')}</Label>
              <Textarea id="message" placeholder={t('contact.form.messagePlaceholder')} className="min-h-[120px]" required />
            </div>
            <Button type="submit" className="w-full">{t('contact.form.button')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;