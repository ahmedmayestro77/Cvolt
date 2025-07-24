import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProRoute from "./components/ProRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import CreateResume from "./pages/CreateResume";
import MyResumes from "./pages/MyResumes";
import MyCoverLetters from "./pages/MyCoverLetters";
import ATSAnalyzer from "./pages/ATSAnalyzer";
import Pricing from "./pages/Pricing";
import Header from "./components/Header";
import EditResume from "./pages/EditResume";
import Contact from "./pages/Contact";
import AuthPage from "./pages/AuthPage";
import AppLayout from "./components/AppLayout";
import { Footer } from "./components/Footer";
import AIResumeGenerator from "./pages/AIResumeGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Header /><Index /><Footer /></>} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Routes that need the header but not the full AppLayout */}
            <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />

            {/* Authenticated Routes with the new AppLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/create" element={<CreateResume />} />
                <Route path="/my-resumes" element={<MyResumes />} />
                <Route path="/my-cover-letters" element={<MyCoverLetters />} />
                <Route path="/edit-resume/:id" element={<EditResume />} />
                <Route path="/pricing" element={<Pricing />} />
                
                {/* Pro-only Routes inside AppLayout */}
                <Route element={<ProRoute />}>
                  <Route path="/ai-resume-generator" element={<AIResumeGenerator />} />
                  <Route path="/ats-analyzer" element={<ATSAnalyzer />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;