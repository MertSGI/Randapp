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
import SuperAdminAISettingsPage from './pages/super-admin/SuperAdminAISettingsPage';
import SuperAdminPlansPage from './pages/super-admin/SuperAdminPlansPage';
import SuperAdminTenantPreviewPage from './pages/super-admin/SuperAdminTenantPreviewPage';
import SitePreviewPage from './pages/admin/SitePreviewPage';

import CustomerLoginPage from './pages/customer/CustomerLoginPage';
import CustomerPortalPage from './pages/customer/CustomerPortalPage';

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

const AppFlowSwitcher: React.FC = () => {
  const { tenant } = useTenant();
  // If there's a tenant loaded, we're in "tenant mode" (except for admin routes which manage themselves)
  return (
    <Routes>
      {/* 1. Marketing Routes */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={
          tenant && !['localhost', '127.0.0.1'].includes(window.location.hostname) && !window.location.hostname.includes('run.app')
            ? <Navigate to="/book" replace /> 
            : <MarketingHomePage />
        } />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/demo" element={<DemoLandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* 2. Salon Booking Routes */}
      <Route element={<SalonBookingLayout />}>
        <Route path="/book" element={<BookingPage />} />
        {/* Dynamic Tenant Routing */}
        <Route path="/:tenantSlug" element={<BookingPage />} />
        {/* AI Tool - Now part of the salon booking flow */}
        <Route path="/ai-visualizer" element={<AIVisualizerPage />} />
      </Route>

      {/* 2.5 Customer Routes */}
      <Route path="/customer/login" element={<CustomerLoginPage />} />
      <Route path="/customer/appointments" element={<CustomerPortalPage />} />
      <Route path="/customer" element={<Navigate to="/customer/appointments" replace />} />

      {/* 3. Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['salon_owner', 'super_admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Route>
      {/* Admin preview route doesn't need standard admin layout so we place it outside it or with a minimal layout*/}
      <Route path="/admin-preview" element={<Navigate to="/admin/site-preview" replace />} />
      <Route path="/admin/site-preview" element={
        <ProtectedRoute allowedRoles={['salon_owner']}>
          <SitePreviewPage />
        </ProtectedRoute>
      } />

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
        <Route path="/super-admin/ai-settings" element={<SuperAdminAISettingsPage />} />
        <Route path="/super-admin/plans" element={<SuperAdminPlansPage />} />
      </Route>
      <Route path="/super-admin/tenant-preview/:tenantId" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <SuperAdminTenantPreviewPage />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route to prevent white screens on unknown paths */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 border-t-4 border-red-500">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Sayfa bulunamadı. Lütfen adresi kontrol edin.</p>
            <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Ana Sayfaya Dön</a>
          </div>
        </div>
      } />
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