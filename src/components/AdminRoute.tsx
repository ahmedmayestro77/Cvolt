import { Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // تم تعطيل التحقق من صلاحيات المشرف مؤقتاً للسماح بالتعديل
  // const { data: profile, isLoading } = useProfile();
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Loader2 className="h-8 w-8 animate-spin" />
  //     </div>
  //   );
  // }
  // if (profile?.role !== 'admin') {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return <Outlet />;
};

export default AdminRoute;