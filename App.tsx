import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import AIVisualizerPage from './pages/AIVisualizerPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TenantProvider } from './contexts/TenantContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppErrorBoundary from './components/AppErrorBoundary';

console.log('[BOOT] App module loaded');

// Use hash routing for embedded previews and browser routing for production
const Router = (import.meta as any).env.VITE_ROUTER_MODE === 'browser' 
  ? BrowserRouter 
  : HashRouter;

const App: React.FC = () => {
  console.log('[BOOT] App rendered');

  const dataMode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
  const routerMode = (import.meta as any).env.VITE_ROUTER_MODE || 'hash';
  console.log('[ENV]', { dataMode, routerMode });

  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <TenantProvider>
            <AuthProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<BookingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute allowedRoles={['salon_owner', 'super_admin']}>
                          <AdminPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/ai-visualizer" element={<AIVisualizerPage />} />
                    {/* Catch-all route to prevent white screens on unknown paths */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </Router>
            </AuthProvider>
          </TenantProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
};

export default App;