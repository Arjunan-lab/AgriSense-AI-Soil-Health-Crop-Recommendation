/**
 * App.jsx
 * -------
 * Root application component.
 *
 * Provider stack (outermost → innermost):
 *   BrowserRouter       → enables React Router
 *   ThemeProvider       → light / dark mode context
 *   AuthProvider        → JWT auth state + localStorage persistence
 *   Toaster             → react-hot-toast notifications (top-right)
 *   AppRoutes           → full route tree
 */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider }  from './context/AuthContext';
import AppRoutes         from './routes/AppRoutes';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            {/* Global toast notifications */}
            <Toaster
              position="top-right"
              gutter={8}
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.08)',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#ffffff' },
                },
                error: {
                  iconTheme: { primary: '#f43f5e', secondary: '#ffffff' },
                },
              }}
            />
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
