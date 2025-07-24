import { Toaster } from "@/components/ui/toaster";
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
import ATSAnalyzer from "./pages/ATSAnalyzer";
import Pricing from "./pages/Pricing";
import Header from "./components/Header";
import EditResume from "./pages/EditResume";
import Contact from "./pages/Contact";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Authenticated Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreateResume />} />
              <Route path="/my-resumes" element={<MyResumes />} />
              <Route path="/edit-resume/:id" element={<EditResume />} />
            </Route>

            {/* Pro-only Routes */}
            <Route element={<ProRoute />}>
              <Route path="/ats-analyzer" element={<ATSAnalyzer />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;