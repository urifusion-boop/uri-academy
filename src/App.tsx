import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { Home } from './pages/Home';
import { Program } from './pages/Program';
import { Pricing } from './pages/Pricing';
import { Register } from './pages/Register';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Graduates } from './pages/Graduates';
import { ForBusinesses } from './pages/ForBusinesses';
import { Login } from './pages/Login';

import { StudentHome } from './pages/StudentHome';
import { Curriculum } from './pages/Curriculum';
import { Assignments } from './pages/Assignments';
import { Attendance } from './pages/Attendance';
import { Capstone } from './pages/Capstone';
import { Certificate } from './pages/Certificate';
import { Payments } from './pages/Payments';
import { Settings } from './pages/Settings';
import { MyGrades } from './pages/MyGrades';

import { AdminHome } from './pages/AdminHome';
import { AdminStudents } from './pages/AdminStudents';
import { AdminCohorts } from './pages/AdminCohorts';
import { AdminContent } from './pages/AdminContent';
import { AdminAssignments } from './pages/AdminAssignments';
import { AdminSubmissions } from './pages/AdminSubmissions';
import { AdminCertificates } from './pages/AdminCertificates';
import { AuthHandler } from './components/AuthHandler';
import { ToastProvider } from './context/ToastContext';
import { DashboardRedirect } from './components/DashboardRedirect';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <ToastProvider>
            <AuthHandler />
            <Routes>
            {/* Redirect /dashboard to /student for Paystack callback compatibility */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/program" element={<Program />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/graduates" element={<Graduates />} />
              <Route path="/business" element={<ForBusinesses />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={<DashboardLayout />}>
              <Route index element={<StudentHome />} />
              <Route path="curriculum" element={<Curriculum />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="capstone" element={<Capstone />} />
              <Route path="certificate" element={<Certificate />} />
              <Route path="grades" element={<MyGrades />} />
              <Route path="payments" element={<Payments />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="cohorts" element={<AdminCohorts />} />
              <Route path="assignments" element={<AdminAssignments />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="certificates" element={<AdminCertificates />} />
            </Route>
          </Routes>
          </ToastProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
