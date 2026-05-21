import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MarketingLayout from './components/layouts/MarketingLayout';
import SalonBookingLayout from './components/layouts/SalonBookingLayout';
import AdminLayout from './components/layouts/AdminLayout';
import SuperAdminLayout from './components/layouts/SuperAdminLayout';

// Pages
import MarketingHomePage from './pages/MarketingHomePage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';

import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import AIVisualizerPage from './pages/AIVisualizerPage';
import DemoLandingPage from './pages/DemoLandingPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminTenantsPage from './pages/super-admin/SuperAdminTenantsPage';
import SuperAdminSubscriptionsPage from './pages/super-admin/SuperAdminSubscriptionsPage';
import SuperAdminPaymentsPage from './pages/super-admin/SuperAdminPaymentsPage';
import SuperAdminOnboardingPage from './pages/super-admin/SuperAdminOnboardingPage';
import SuperAdminReportsPage from './pages/super-admin/SuperAdminReportsPage';
import SuperAdminSettingsPage from './pages/super-admin/SuperAdminSettingsPage';
import SuperAdminPaymentTestPage from './pages/super-admin/SuperAdminPaymentTestPage';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TenantProvider, useTenant } from './contexts/TenantContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppErrorBoundary from './components/AppErrorBoundary';

// Use hash routing for embedded previews and browser routing for production
const Router = (import.meta as any).env.VITE_ROUTER_MODE === 'browser' 
  ? BrowserRouter 
  : HashRouter;

// A wrapper to decide if root goes to Marketing or Booking
const RootRedirector: React.FC = () => {
  const { tenantStatus } = useTenant();
  // If no tenant is resolved, default to Marketing Layout pages via Outlet approach.
  // Actually, wait, react-router handles this via index.
  // We can just use the Marketing layout if no tenant is set, else Booking layout.
  return <Navigate to="/marketing-home" replace />;
}

const AppFlowSwitcher: React.FC = () => {
  const { tenant } = useTenant();
  // If there's a tenant loaded, we're in "tenant mode" (except for admin routes which manage themselves)
  return (
    <Routes>
      {/* 1. Marketing Routes */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={tenant ? <Navigate to="/book" replace /> : <MarketingHomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/demo" element={<DemoLandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* 2. Salon Booking Routes */}
      <Route element={<SalonBookingLayout />}>
        <Route path="/book" element={<BookingPage />} />
        {/* AI Tool - Now part of the salon booking flow */}
        <Route path="/ai-visualizer" element={<AIVisualizerPage />} />
      </Route>

      {/* 3. Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['salon_owner', 'super_admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Route>

      {/* 4. Super Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminLayout /></ProtectedRoute>}>
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/tenants" element={<SuperAdminTenantsPage />} />
        <Route path="/super-admin/subscriptions" element={<SuperAdminSubscriptionsPage />} />
        <Route path="/super-admin/payments" element={<SuperAdminPaymentsPage />} />
        <Route path="/super-admin/onboarding" element={<SuperAdminOnboardingPage />} />
        <Route path="/super-admin/reports" element={<SuperAdminReportsPage />} />
        <Route path="/super-admin/settings" element={<SuperAdminSettingsPage />} />
        <Route path="/super-admin/payment-test" element={<SuperAdminPaymentTestPage />} />
      </Route>
      
      {/* Catch-all route to prevent white screens on unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <TenantProvider>
            <AuthProvider>
              <Router>
                <AppFlowSwitcher />
              </Router>
            </AuthProvider>
          </TenantProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
};

export default App;