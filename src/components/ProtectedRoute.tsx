import { useAuth } from '@/hooks/use-auth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;