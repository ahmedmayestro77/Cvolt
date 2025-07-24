import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, LayoutTemplate, FileText, BarChart } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              إنشاء سيرة ذاتية جديدة
            </CardTitle>
            <CardDescription>ابدأ في بناء سيرتك الذاتية من الصفر أو باستخدام قالب.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/create">
              <Button className="w-full">ابدأ الآن</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-primary" />
              تصفح القوالب
            </CardTitle>
            <CardDescription>اكتشف مجموعتنا الواسعة من القوالب الاحترافية.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/templates">
              <Button variant="outline" className="w-full">عرض القوالب</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              سيرتي الذاتية
            </CardTitle>
            <CardDescription>إدارة وتعديل سيرك الذاتية الموجودة.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/my-resumes">
              <Button variant="outline" className="w-full">عرض السير</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              تحليل ATS و CVOLT-Score
            </CardTitle>
            <CardDescription>حسّن سيرتك الذاتية لتجاوز أنظمة تتبع المتقدمين.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/ats-analyzer">
              <Button variant="outline" className="w-full">تحليل الآن</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;