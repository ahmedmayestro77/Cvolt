import { useProfile } from '@/hooks/use-profile';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProRoute = () => {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (profile?.subscription_status !== 'pro') {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
};

export default ProRoute;