import { useAuth } from '@/hooks/use-auth';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProRoute = () => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.subscription_status !== 'pro') {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
};

export default ProRoute;