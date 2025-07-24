import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useCoverLetters } from '@/hooks/use-cover-letters';
import { getCoverLetterFormSchema, CoverLetterFormValues } from '@/lib/coverLetterSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { showError } from '@/utils/toast';

const EditCoverLetter = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { useGetCoverLetterById, useAddCoverLetter, useUpdateCoverLetter } = useCoverLetters();

  const isEditMode = Boolean(id);
  const { data: coverLetterToEdit, isLoading: isLoadingCoverLetter } = useGetCoverLetterById(id);
  const addMutation = useAddCoverLetter();
  const updateMutation = useUpdateCoverLetter();
  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  const formSchema = getCoverLetterFormSchema(t);
  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: '',
      company_name: '',
      content: '',
    },
  });

  useEffect(() => {
    if (isEditMode && coverLetterToEdit) {
      form.reset(coverLetterToEdit);
    } else if (location.state?.aiGeneratedData) {
      const { job_title, company_name, content } = location.state.aiGeneratedData;
      form.reset({
        job_title: job_title || '',
        company_name: company_name || '',
        content: content || '',
      });
    }
  }, [isEditMode, coverLetterToEdit, location.state, form]);

  useEffect(() => {
    if (isEditMode && !isLoadingCoverLetter && !coverLetterToEdit) {
      showError(t('editCoverLetter.notFound', 'Cover letter not found.'));
      navigate('/my-cover-letters');
    }
  }, [isLoadingCoverLetter, coverLetterToEdit, isEditMode, navigate, t]);

  const onSubmit = (values: CoverLetterFormValues) => {
    if (isEditMode && id) {
      updateMutation.mutate({ id, updatedValues: values }, {
        onSuccess: () => navigate('/my-cover-letters'),
      });
    } else {
      addMutation.mutate(values, {
        onSuccess: () => navigate('/my-cover-letters'),
      });
    }
  };

  if (isLoadingCoverLetter) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center">
            {isEditMode ? t('editCoverLetter.title', 'Edit Cover Letter') : t('createCoverLetter.title', 'Create Cover Letter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="job_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('coverLetterForm.jobTitle', 'Job Title')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('coverLetterForm.jobTitlePlaceholder', 'e.g., Senior Software Engineer')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('coverLetterForm.companyName', 'Company Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('coverLetterForm.companyNamePlaceholder', 'e.g., Tech Innovations Inc.')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('coverLetterForm.content', 'Content')}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[400px] text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditMode ? t('common.saveChanges', 'Save Changes') : t('common.create', 'Create')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoverLetter;