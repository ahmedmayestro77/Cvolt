import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
  const { session } = useAuth();
  const { t } = useTranslation();

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t('auth.welcome')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
            theme="light"
            redirectTo={window.location.origin + '/dashboard'}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;