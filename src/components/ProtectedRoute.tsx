import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // تم تعطيل التحقق من تسجيل الدخول مؤقتاً للسماح بالتعديل
  // const { session, loading } = useAuth();
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Loader2 className="h-8 w-8 animate-spin" />
  //     </div>
  //   );
  // }
  // if (!session) {
  //   return <Navigate to="/auth" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;