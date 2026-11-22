/**
 * pages/LoginPage.jsx
 * -------------------
 * Public login page with runtime translations.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { loginUser } from '../api/auth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const { isAuthenticated, loading, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const { tokens, user } = await loginUser(data);
      await login(tokens.access_token, tokens.refresh_token, user);
      toast.success(`${t('Welcome back')}, ${user.username}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        t('Invalid email or password. Please try again.');
      setServerError(t(msg));
      toast.error(t('Login failed'));
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      {/* Left decorative panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-12 text-white"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sprout className="h-7 w-7" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight">Scatter AI</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            {t('AI-Powered')}<br />{t('Soil Intelligence')}<br />&amp; {t('Crop Guidance')}
          </h1>
          <p className="text-base text-white/80 max-w-sm leading-relaxed">
            {t('Upload a soil image and receive instant crop recommendations, health scores, and agronomic insights — all powered by EfficientNetB2 and CatBoost.')}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {[t('Soil Classification'), t('Crop Recommendation'), t('Health Scoring'), t('PDF Reports')].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Scatter AI. {t('Agricultural Intelligence Platform.')}
        </p>
      </motion.div>

      {/* Right panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center p-8 md:p-12"
      >
        <div className="flex items-center space-x-2 mb-10 lg:hidden">
          <div className="p-1.5 bg-primary-500 rounded-lg text-white">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-800 dark:text-slate-50">
            Scatter <span className="text-primary-500">AI</span>
          </span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight">
              {t('Welcome back')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('Sign in to your account to continue')}
            </p>
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl"
            >
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 leading-relaxed">
                {serverError}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t('Email Address')} <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={`w-full pl-11 pr-4 py-2.5 rounded-card border bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors
                    ${errors.email
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                  {t(errors.email.message)}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t('Password')} <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-11 pr-11 py-2.5 rounded-card border bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors
                    ${errors.password
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                  {t(errors.password.message)}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-card transition-colors shadow-soft text-sm mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{t('Signing in...')}</span>
                </>
              ) : (
                <>
                  <span>{t('Sign In')}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {t("Don't have an account?")}{' '}
            <Link
              to="/register"
              className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
            >
              {t('Create one free')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
