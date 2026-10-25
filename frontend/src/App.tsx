import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public pages
import { HomePage } from './pages/HomePage';
import { FreelancersPage } from './pages/FreelancersPage';
import { FreelancerDetailPage } from './pages/FreelancerDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { PostProjectPage } from './pages/PostProjectPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AuthPage } from './pages/AuthPage';

// Client workspace pages
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { ClientProjectsPage } from './pages/client/ClientProjectsPage';
import { ClientMessagesPage } from './pages/client/ClientMessagesPage';
import { ClientSavedPage } from './pages/client/ClientSavedPage';
import { ClientProfilePage } from './pages/client/ClientProfilePage';

// Freelancer workspace pages
import { FreelancerDashboardPage } from './pages/FreelancerDashboardPage';
import { FreelancerApplicationsPage } from './pages/freelancer/FreelancerApplicationsPage';
import { FreelancerPortfolioPage } from './pages/freelancer/FreelancerPortfolioPage';
import { FreelancerInquiriesPage } from './pages/freelancer/FreelancerInquiriesPage';
import { FreelancerSavedPage } from './pages/freelancer/FreelancerSavedPage';
import { FreelancerProfilePage } from './pages/freelancer/FreelancerProfilePage';

// Admin workspace pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <ScrollToTop />
          <ToastContainer />
          <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/freelancers" element={<FreelancersPage />} />
                <Route path="/freelancer/:id" element={<FreelancerDetailPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/project/:id" element={<ProjectDetailPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />

                {/* Client Routes — Protected */}
                <Route path="/post-project" element={<ProtectedRoute allowedRoles={['client']}><PostProjectPage /></ProtectedRoute>} />
                <Route path="/dashboard/client" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboardPage /></ProtectedRoute>} />
                <Route path="/client/projects" element={<ProtectedRoute allowedRoles={['client']}><ClientProjectsPage /></ProtectedRoute>} />
                <Route path="/client/messages" element={<ProtectedRoute allowedRoles={['client']}><ClientMessagesPage /></ProtectedRoute>} />
                <Route path="/client/saved" element={<ProtectedRoute allowedRoles={['client']}><ClientSavedPage /></ProtectedRoute>} />
                <Route path="/client/profile" element={<ProtectedRoute allowedRoles={['client']}><ClientProfilePage /></ProtectedRoute>} />

                {/* Freelancer Routes — Protected */}
                <Route path="/dashboard/freelancer" element={<ProtectedRoute allowedRoles={['freelancer']}><FreelancerDashboardPage /></ProtectedRoute>} />
                <Route path="/freelancer/applications" element={<ProtectedRoute allowedRoles={['freelancer']}><FreelancerApplicationsPage /></ProtectedRoute>} />
                <Route path="/freelancer/portfolio" element={<ProtectedRoute allowedRoles={['freelancer']}><FreelancerPortfolioPage /></ProtectedRoute>} />
                <Route path="/freelancer/inquiries" element={<ProtectedRoute allowedRoles={['freelancer']}><FreelancerInquiriesPage /></ProtectedRoute>} />
                <Route path="/freelancer/saved" element={<ProtectedRoute allowedRoles={['freelancer']}><FreelancerSavedPage /></ProtectedRoute>} />
                <Route path="/freelancer/profile" element={<ProtectedRoute allowedRoles={['freelancer']}><FreelancerProfilePage /></ProtectedRoute>} />

                {/* Admin Routes — Protected (admin only) */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
                <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={['admin']}><AdminProjectsPage /></ProtectedRoute>} />
                <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={['admin']}><AdminReviewsPage /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettingsPage /></ProtectedRoute>} />

                {/* Catch-all */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
