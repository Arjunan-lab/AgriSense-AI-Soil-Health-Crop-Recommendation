import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import { PageSkeleton } from '../components/common/Loader';

// Lazy loaded page components for optimal bundle code-splitting
const LandingPage = lazy(() => import('../pages/LandingPage'));
const GuestExperiencePage = lazy(() => import('../pages/GuestExperiencePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard'));
const CompleteAnalysis = lazy(() => import('../pages/CompleteAnalysis'));
const HistoryPage = lazy(() => import('../pages/History'));
const HistoryDetailPage = lazy(() => import('../pages/HistoryDetailPage'));
const SystemPage = lazy(() => import('../pages/SystemPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const FeedbackPage = lazy(() => import('../pages/FeedbackPage'));

const RootRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/guest" element={<GuestExperiencePage />} />

        {/* Public auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analysis" element={<CompleteAnalysis />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

