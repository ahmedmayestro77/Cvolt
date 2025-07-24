import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import EditCoverLetter from "./pages/EditCoverLetter";
import Contact from "./pages/Contact";
import AuthPage from "./pages/AuthPage";
import AppLayout from "./components/AppLayout";
import { Footer } from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";

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
                <Route path="/cover-letter/create" element={<EditCoverLetter />} />
                <Route path="/cover-letter/edit/:id" element={<EditCoverLetter />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/ats-analyzer" element={<ATSAnalyzer />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
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