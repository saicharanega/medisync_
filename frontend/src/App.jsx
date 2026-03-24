import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-provider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Index from "./pages/Index";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import NotFound from "./pages/NotFound";

// Doctor Portal
import DoctorPortalLayout from "./components/layout/DoctorPortalLayout";
import DoctorOverview from "./pages/doctor/DoctorOverview";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";
import DoctorEarnings from "./pages/doctor/DoctorEarnings";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Admin Portal
import AdminPortalLayout from "./components/layout/AdminPortalLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "563456789-mockplaceholder.apps.googleusercontent.com";

const App = () =>
<QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public / Patient routes */}
            <Route path="/" element={<Index />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:id" element={<DoctorDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-appointments" element={<MyAppointmentsPage />} />

            {/* Doctor Portal */}
            <Route path="/doctor-dashboard" element={<DoctorPortalLayout />}>
              <Route index element={<DoctorOverview />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="availability" element={<DoctorAvailability />} />
              <Route path="earnings" element={<DoctorEarnings />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>

            {/* Admin Portal */}
            <Route path="/admin" element={<AdminPortalLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
</QueryClientProvider>;

export default App;