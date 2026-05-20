import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import AIVisualizerPage from './pages/AIVisualizerPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TenantProvider } from './contexts/TenantContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <TenantProvider>
    <AuthProvider>
    <ThemeProvider>
      <LanguageProvider>
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
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
    </AuthProvider>
    </TenantProvider>
  );
};

export default App;