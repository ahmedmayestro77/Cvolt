import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          CVOLT: سيرتك الذاتية الاحترافية بلمسة ذكاء اصطناعي
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10">
          أنشئ سيرًا ذاتية مذهلة، حسّنها للـ ATS، وتتبع طلبات وظائفك بكل سهولة.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="px-8 py-3 text-lg">
              ابدأ الآن
            </Button>
          </Link>
          <Link to="/templates">
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700">
              تصفح القوالب
            </Button>
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;