/**
 * pages/RegisterPage.jsx
 * ----------------------
 * Public registration page with fully functional form.
 * Uses react-hook-form + zod for validation.
 * Calls POST /auth/register, then navigates to /login on success.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Sprout,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/auth';

import { fetchSupportedLanguages, FALLBACK_LANGUAGES } from '../services/languages';

// ── Constants ──────────────────────────────────────────────────────────────

const FEATURES = [
  'EfficientNetB2 soil image classification',
  'CatBoost crop recommendation engine',
  'Real-time soil health scoring',
  'Complete analysis history & PDF reports',
];

// ── Validation schema ──────────────────────────────────────────────────────

const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, 'Username must be at least 2 characters')
      .max(50, 'Username must be at most 50 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/\d/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
    preferred_language: z.string().min(1, 'Please select a preferred language'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

// ── Component ──────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES);

  useEffect(() => {
    fetchSupportedLanguages().then((list) => {
      if (list && list.length > 0) {
        setLanguages(list);
      }
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      preferred_language: 'English',
    },
  });

  // Redirect already-authenticated users
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser(data);
      toast.success('Account created! Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please try again.';
      setServerError(msg);
      toast.error('Registration failed');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      {/* Left decorative panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-700 via-primary-500 to-secondary-500 p-12 text-white"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sprout className="h-7 w-7" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight">Scatter AI</span>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight">
              Start making smarter<br />farming decisions today.
            </h1>
            <p className="text-base text-white/80 leading-relaxed max-w-sm">
              Join the platform trusted by agronomists for instant, AI-driven soil
              classification and crop recommendation.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start space-x-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-secondary-300 mt-0.5 shrink-0" />
                <span className="text-white/85">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Scatter AI. Agricultural Intelligence Platform.
        </p>
      </motion.div>

      {/* Right: Register form panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto"
      >
        {/* Mobile brand */}
        <div className="flex items-center space-x-2 mb-8 lg:hidden">
          <div className="p-1.5 bg-primary-500 rounded-lg text-white">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-800 dark:text-slate-50">
            Scatter <span className="text-primary-500">AI</span>
          </span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Free forever. No credit card required.
            </p>
          </div>

          {/* Server-level error banner */}
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
            {/* Username */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="reg-username" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-username"
                  type="text"
                  autoComplete="username"
                  placeholder="johndoe"
                  {...register('username')}
                  className={`w-full pl-11 pr-4 py-2.5 rounded-card border bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors
                    ${errors.username
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'
                    }`}
                />
              </div>
              {errors.username && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="reg-email" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-email"
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
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="reg-password" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 8 chars, uppercase, number, symbol"
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
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="reg-confirm" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register('confirm_password')}
                  className={`w-full pl-11 pr-11 py-2.5 rounded-card border bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors
                    ${errors.confirm_password
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Preferred Language */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="reg-language" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Preferred Language <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Globe className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  id="reg-language"
                  {...register('preferred_language')}
                  className={`w-full pl-11 pr-4 py-2.5 rounded-card border bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none transition-colors appearance-none
                    ${errors.preferred_language
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'
                    }`}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.name}>
                      {lang.name} ({lang.native})
                    </option>
                  ))}
                </select>
              </div>
              {errors.preferred_language && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                  {errors.preferred_language.message}
                </p>
              )}
            </div>

            {/* Submit */}
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
