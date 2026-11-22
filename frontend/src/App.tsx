import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Eye, EyeOff, User, Mail, Phone, Lock, Globe, MapPin, Shield, Search, TrendingUp, Filter, Calendar, Bot, MessageSquare, FileText } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage.tsx'
import AuthPages from './pages/AuthPages'
import FarmerDashboard from './pages/FarmerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { SoilClassification, CropRecommendation, FertilizerRecommendation, DiseaseDetection } from './pages/AIModules'
import AIChatbot from './pages/AIChatbot'
import { WeatherDashboard, PredictionHistory, Notifications, Feedback, Profile, Settings } from './pages/MorePages'
import { About } from './pages/About'
import GuestExperience from './pages/GuestExperience'
import FarmerCommunity from './pages/FarmerCommunity'
import FloatingChatbot from './components/FloatingChatbot'
import AdminCommunityAnalytics from './pages/AdminCommunityAnalytics'
import { Toast, LineSpinner, Input, SelectInput, Button } from './components/ui'
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { FEATURES } from './config'
import { useAuth } from './contexts/AuthContext'
import { adminAPI } from './api/admin'
import { apiClient } from './api/client'
import { notificationAPI } from './api/notification'

type AppState = 'landing' | 'auth' | 'app' | 'guest'
type Role = 'farmer' | 'admin'
export type ThemeMode = 'light' | 'dark' | 'system'

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 1800)
    const t2 = setTimeout(() => onDone(), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])
  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface transition-opacity duration-500${exiting ? ' opacity-0' : ' opacity-100'}`}>
      <div className="flex flex-col items-center select-none animate-slide-in-up">
        <svg viewBox="0 0 40 40" width="48" height="48" overflow="visible" aria-hidden="true" className="mb-4">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#E6F4EA" strokeWidth="6" />
          <path d="M 20 4 A 16 16 0 0 1 36 20" fill="none" stroke="#2E7D32" strokeWidth="6" strokeLinecap="round" className="animate-spin-slow" style={{ transformOrigin: '20px 20px' }} />
        </svg>
        <p className="text-text-primary font-heading font-bold text-2xl tracking-tight">
          Agro<span className="text-primary-600">AI</span>
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const { user, isAuthenticated, isLoading: authLoading, logout: authLogout } = useAuth()
  const role: Role = user?.is_admin || user?.role === 'admin' ? 'admin' : 'farmer'

  const [splashDone, setSplashDone] = useState(false)
  const [appState, setAppState] = useState<AppState>('landing')
  const [authPage, setAuthPage] = useState<'login' | 'register' | 'forgot'>('login')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auto-login transition
  useEffect(() => {
    if (isAuthenticated && appState !== 'app') {
      setAppState('app')
    }
  }, [isAuthenticated])

  // ── Theme state: persisted, system-aware ──────────────────
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() =>
    (localStorage.getItem('agroai_theme') as ThemeMode) || 'dark'
  )
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [themeToast, setThemeToast] = useState<string | null>(null)

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemDark)

  // Synchronize dark-mode class to document.body & document.documentElement for portaled modals
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode', 'dark')
      document.documentElement.classList.add('dark-mode', 'dark')
    } else {
      document.body.classList.remove('dark-mode', 'dark')
      document.documentElement.classList.remove('dark-mode', 'dark')
    }
  }, [isDark])

  // Listen to OS theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    localStorage.setItem('agroai_theme', mode)
    const messages: Record<ThemeMode, string> = {
      light: '☀️ Light Theme Enabled',
      dark: '🌙 Dark Theme Enabled',
      system: '💻 Following System Theme',
    }
    setThemeToast(messages[mode])
    setTimeout(() => setThemeToast(null), 2500)
  }

  // Nav toggle cycles between light ↔ dark
  const handleNavToggle = () => setThemeMode(isDark ? 'light' : 'dark')

  const handleLogin = (r: Role) => {
    setCurrentPage('dashboard')
    setAppState('app')
  }

  // ── Global notification state ─────────────────────────────
  const [notifUnreadCount, setNotifUnreadCount] = useState<number>(0)

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return
    try {
      const res = await notificationAPI.getNotificationCount()
      setNotifUnreadCount(res.unread_count || 0)
    } catch (err) {
      console.warn("Could not fetch notification unread count:", err)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 60000) // 60s polling
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const markNotifRead = async (id: string) => {
    try {
      await notificationAPI.markNotificationRead(Number(id))
      fetchUnreadCount()
    } catch (err) {
      console.warn("Could not mark notification read:", err)
      setNotifUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllNotifsRead = async () => {
    try {
      await notificationAPI.markAllNotificationsRead()
      setNotifUnreadCount(0)
    } catch (err) {
      console.warn("Could not mark all notifications read:", err)
      setNotifUnreadCount(0)
    }
  }

  const handleLogout = async () => {
    await authLogout()
    setAppState('landing')
    setCurrentPage('dashboard')
  }

  const goToAuth = (page: 'login' | 'register' = 'login') => {
    setAuthPage(page)
    setAppState('auth')
  }

  if (!splashDone || authLoading) {
    return <SplashScreen onDone={() => setSplashDone(true)} />
  }

  if (appState === 'landing') {
    return (
      <LandingPage
        isDark={isDark}
        onToggleDark={handleNavToggle}
        onLogin={() => goToAuth('login')}
        onRegister={() => goToAuth('register')}
        onGuestTrial={() => setAppState('guest')}
      />
    )
  }

  if (appState === 'guest') {
    return (
      <GuestExperience
        onLogin={() => goToAuth('login')}
        onRegister={() => goToAuth('register')}
      />
    )
  }

  if (appState === 'auth') {
    return <AuthPages onLogin={handleLogin} onBack={() => setAppState('landing')} initialPage={authPage} />
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-background ${isDark ? 'dark-mode' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static z-50 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          role={role}
          currentPage={currentPage}
          onNavigate={(page) => { setCurrentPage(page); setSidebarOpen(false) }}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
          notifBadge={notifUnreadCount}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          role={role}
          page={currentPage}
          darkMode={isDark}
          onToggleDark={handleNavToggle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={setCurrentPage}
          unreadNotifs={notifUnreadCount}
        />

        {currentPage === 'chatbot' ? (
          <AIChatbot />
        ) : (
          <main key={currentPage} className="flex-1 overflow-y-auto bg-background animate-page-enter">
            {currentPage === 'dashboard' && role === 'farmer' && <FarmerDashboard onNavigate={setCurrentPage} />}
            {currentPage === 'dashboard' && role === 'admin' && <AdminDashboard onNavigate={setCurrentPage} />}
            {currentPage === 'soil' && <SoilClassification onNavigate={setCurrentPage} />}
            {currentPage === 'crop' && <CropRecommendation onNavigate={setCurrentPage} />}
            {currentPage === 'fertilizer' && <FertilizerRecommendation onNavigate={setCurrentPage} />}
            {FEATURES.DISEASE_DETECTION && currentPage === 'disease' && <DiseaseDetection onNavigate={setCurrentPage} />}
            {currentPage === 'weather' && <WeatherDashboard onNavigate={setCurrentPage} />}
            {currentPage === 'community' && <FarmerCommunity onNavigate={setCurrentPage} />}
            {currentPage === 'history' && <PredictionHistory onNavigate={setCurrentPage} />}
            {currentPage === 'notifications' && <Notifications onNavigate={setCurrentPage} onMarkRead={markNotifRead} onMarkAllRead={markAllNotifsRead} />}
            {currentPage === 'feedback' && <Feedback role={role} onNavigate={setCurrentPage} />}
            {currentPage === 'profile' && <Profile onNavigate={setCurrentPage} />}
            {currentPage === 'about' && <About onNavigate={setCurrentPage} />}
            {currentPage === 'settings' && <Settings themeMode={themeMode} role={role} onSetTheme={setThemeMode} onNavigate={setCurrentPage} />}
            {currentPage === 'chatbot-monitoring' && <AdminChatbotMonitoring isDark={isDark} />}
            {currentPage === 'users' && <AdminUserManagement isDark={isDark} />}
            {currentPage === 'analytics' && <AdminAnalytics />}
            {currentPage === 'community-analytics' && <AdminCommunityAnalytics />}
            {currentPage === 'reports' && <AdminReports />}
          </main>
        )}
      </div>

      {currentPage !== 'chatbot' && currentPage !== 'aichatbot' && <FloatingChatbot />}

      {themeToast && (
        <Toast message={themeToast} type="success" onClose={() => setThemeToast(null)} />
      )}
    </div>
  )
}

// ---- Admin Stub Pages ----

const ADD_USER_LANGUAGES = ['English', 'Hindi', 'Arabic', 'Tamil', 'Telugu', 'Marathi', 'Punjabi', 'Bengali', 'Urdu', 'Kannada']
const ADD_USER_COUNTRIES = ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'UAE', 'Kenya', 'Nigeria']
const ADD_USER_PERMISSIONS = ['User Management', 'Analytics', 'Reports', 'Feedback', ...(FEATURES.DISEASE_DETECTION ? ['Disease Detection'] : []), 'Crop Recommendation', 'Weather', 'Notifications']

interface UserRecord {
  name: string; email: string; role: string; status: string; region: string; joined: string
}

function AddUserModal({ existingEmails, onClose, onSuccess }: {
  existingEmails: string[]
  onClose: () => void
  onSuccess: (u: UserRecord) => void
}) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
    role: 'Farmer', language: 'English',
    country: 'India', state: '', district: '', city: '', postalCode: '',
    accountStatus: 'active',
    permissions: [] as string[],
  })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [loading, setLoading] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { firstInputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const togglePermission = (p: string) =>
    setForm(f => ({ ...f, permissions: f.permissions.includes(p) ? f.permissions.filter(x => x !== p) : [...f.permissions, p] }))

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isDuplicateEmail = existingEmails.map(e => e.toLowerCase()).includes(form.email.toLowerCase().trim())

  const errs = {
    name: attempted && !form.name.trim() ? 'Name is required.' : '',
    email: attempted
      ? !form.email.trim() ? 'Email is required.'
        : !emailRe.test(form.email) ? 'Please enter a valid email address.'
        : isDuplicateEmail ? 'This email address is already registered.'
        : ''
      : '',
    password: attempted
      ? !form.password ? 'Password is required.'
        : form.password.length < 8 ? 'Password must be at least 8 characters.'
        : ''
      : '',
    confirm: attempted
      ? !form.confirm ? 'Please confirm your password.'
        : form.confirm !== form.password ? 'Passwords do not match.'
        : ''
      : '',
    state: attempted && !form.state.trim() ? 'State is required.' : '',
    district: attempted && !form.district.trim() ? 'District is required.' : '',
    city: attempted && !form.city.trim() ? 'City / Village / Town is required.' : '',
  }

  const isValid =
    form.name.trim().length > 0 &&
    emailRe.test(form.email) && !isDuplicateEmail &&
    form.password.length >= 8 && form.confirm === form.password &&
    form.state.trim().length > 0 && form.district.trim().length > 0 && form.city.trim().length > 0

  const handleSubmit = () => {
    setAttempted(true)
    if (!isValid) return
    setLoading(true)
    setTimeout(() => {
      onSuccess({
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.accountStatus,
        region: `${form.state}, ${form.country}`,
        joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })
    }, 1500)
  }

  const Req = () => <span className="text-red-500 ml-0.5" aria-hidden>*</span>
  const FieldErr = ({ msg }: { msg: string }) =>
    msg ? <p className="text-xs text-red-500 mt-1" role="alert">{msg}</p> : null

  const inputCls = (err: string) =>
    `w-full py-2.5 rounded-xl border text-sm bg-surface placeholder-text-muted transition-colors ${err ? 'border-red-400' : 'border-border hover:border-border'}`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface rounded-t-2xl sm:rounded-2xl shadow-elevated w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-slide-in-up sm:animate-fade-in">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Add New User</h2>
            <p className="text-sm text-text-muted mt-0.5">Create a new account for a farmer or administrator.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-background transition-colors mt-0.5 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Personal Information */}
          <section>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Personal Information</p>
            <div className="space-y-4">
              <Input 
                label="Full Name" 
                required 
                error={errs.name} 
                value={form.name} 
                onChange={e => set('name', e.target.value)} 
                placeholder="Enter full name" 
                icon={<User size={14} />} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Email Address" 
                  required 
                  error={errs.email} 
                  type="email" 
                  value={form.email} 
                  onChange={e => set('email', e.target.value)} 
                  placeholder="user@example.com" 
                  icon={<Mail size={14} />} 
                />
                <Input 
                  label="Phone Number" 
                  hint="(Optional)" 
                  type="tel" 
                  value={form.phone} 
                  onChange={e => set('phone', e.target.value)} 
                  placeholder="+91 98765 43210" 
                  icon={<Phone size={14} />} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input 
                    label="Password" 
                    required 
                    error={errs.password} 
                    type={showPw ? 'text' : 'password'} 
                    value={form.password} 
                    onChange={e => set('password', e.target.value)} 
                    placeholder="Min. 8 characters" 
                    icon={<Lock size={14} />} 
                  />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-text-muted hover:text-text-secondary">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    label="Confirm Password" 
                    required 
                    error={errs.confirm} 
                    type={showConfirm ? 'text' : 'password'} 
                    value={form.confirm} 
                    onChange={e => set('confirm', e.target.value)} 
                    placeholder="Re-enter password" 
                    icon={<Lock size={14} />} 
                  />
                  <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-[38px] text-text-muted hover:text-text-secondary">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput 
                  label="User Role" 
                  value={form.role} 
                  onChange={e => set('role', e.target.value)} 
                  options={['Farmer', 'Admin'].map(r => ({ value: r, label: r }))} 
                />
                <SelectInput 
                  label="Language Preference" 
                  value={form.language} 
                  onChange={e => set('language', e.target.value)} 
                  options={ADD_USER_LANGUAGES.map(l => ({ value: l, label: l }))} 
                />
              </div>
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Location */}
          <section>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Location Information</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput 
                  label="Country" 
                  value={form.country} 
                  onChange={e => set('country', e.target.value)} 
                  options={ADD_USER_COUNTRIES.map(c => ({ value: c, label: c }))} 
                />
                <Input label="State" required error={errs.state} value={form.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Punjab" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="District" required error={errs.district} value={form.district} onChange={e => set('district', e.target.value)} placeholder="e.g. Ludhiana" />
                <Input label="City / Village / Town" required error={errs.city} value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Kotkapura" />
              </div>
              <div className="md:max-w-xs">
                <Input label="Postal Code" hint="(Optional)" value={form.postalCode} onChange={e => set('postalCode', e.target.value)} placeholder="e.g. 142001" />
              </div>
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Account Status */}
          <section>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Account Status</p>
            <div className="flex gap-3">
              {(['active', 'inactive'] as const).map(s => (
                <button key={s} onClick={() => set('accountStatus', s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all capitalize ${
                    form.accountStatus === s
                      ? s === 'active' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-400 bg-background text-text-secondary'
                      : 'border-border text-text-muted hover:border-border'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${form.accountStatus === s ? (s === 'active' ? 'bg-green-500' : 'bg-gray-500') : 'bg-background'}`} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Permissions – Admin only */}
          {form.role === 'Admin' && (
            <>
              <div className="border-t border-border" />
              <section>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Permissions <span className="normal-case font-normal text-text-muted">(Optional)</span>
                </p>
                <p className="text-xs text-text-muted mb-3">Select the modules this {form.role.toLowerCase()} can access.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ADD_USER_PERMISSIONS.map(p => (
                    <label key={p} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs font-medium select-none ${
                      form.permissions.includes(p) ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-border text-text-secondary hover:border-border bg-surface'
                    }`}>
                      <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePermission(p)} className="accent-blue-600 w-3.5 h-3.5 flex-shrink-0" />
                      {p}
                    </label>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-background rounded-b-2xl flex-shrink-0">
          <p className="text-xs text-text-muted hidden sm:block"><span className="text-red-500">*</span> Required fields</p>
          <div className="flex gap-3 ml-auto">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:bg-background transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="px-5 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center gap-2 min-w-[120px] justify-center transition-all">
              {loading ? <><LineSpinner size={14} color="white" strokeWidth={2} /> Creating user...</> : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


function AdminChatbotMonitoring({ isDark = false }: { isDark?: boolean }) {
  const [timeRange, setTimeRange] = useState('Last 7 Days')
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [chatbotData, setChatbotData] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLogs, setSearchLogs] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input (250ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchLogs)
    }, 250)
    return () => clearTimeout(handler)
  }, [searchLogs])

  // Fetch live chatbot analytics & activity logs from backend
  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        const [cbAnalytics, dashData, logsRes] = await Promise.all([
          adminAPI.getChatbotAnalytics().catch(() => null),
          adminAPI.getDashboardStats().catch(() => null),
          adminAPI.getChatbotLogs({ search: debouncedSearch || undefined, limit: 50 }).catch(() => null),
        ])

        if (isMounted) {
          setChatbotData(cbAnalytics)
          setDashboardData(dashData)

          if (logsRes && logsRes.logs) {
            setRecentLogs(logsRes.logs)
          } else if (dashData && dashData.recent_activities) {
            const mapped = dashData.recent_activities.map((act: any, i: number) => ({
              id: act.id || `conv-${i + 100}`,
              conversation_id: `CONV-${1000 + i}`,
              date: act.timestamp ? new Date(act.timestamp).toISOString().replace('T', ' ').slice(0, 16) : '2026-08-02 17:41',
              time: act.timestamp ? new Date(act.timestamp).toISOString().replace('T', ' ').slice(0, 16) : '2026-08-02 17:41',
              user: act.user_id ? `User #${act.user_id}` : (act.description?.split('by ')[1] || 'Farmer User'),
              email: 'user@farm.com',
              role: act.role || 'Farmer',
              lang: act.language || 'English',
              country: 'India',
              state: 'Punjab',
              district: 'Ludhiana',
              q: act.description || 'What is the optimal sowing date for wheat?',
              answer: 'Optimal sowing for wheat in Punjab is early to mid November with soil temperature around 20-22°C.',
              topic: act.type === 'prediction_made' ? 'Crop Recommendation' : 'Miscellaneous Things',
              status: 'Resolved',
              responseTime: '1.2s',
            }))
            setRecentLogs(mapped)
          } else {
            setRecentLogs([])
          }
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load Chatbot Monitoring backend data:', err)
        if (isMounted) setLoading(false)
      }
    }

    loadData()
  }, [timeRange, debouncedSearch])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B']

  // 1. Total Conversations Card
  const totalConversationsVal = chatbotData?.total_conversations != null
    ? chatbotData.total_conversations.toLocaleString()
    : (dashboardData?.overview?.chatbot_conversations != null ? dashboardData.overview.chatbot_conversations.toLocaleString() : '0')

  // 2. Questions Today Card
  const questionsTodayVal = chatbotData?.user_messages != null
    ? chatbotData.user_messages.toLocaleString()
    : (dashboardData?.overview?.chatbot_questions != null ? dashboardData.overview.chatbot_questions.toLocaleString() : '0')

  // 3. Active Chatbot Users Today Card
  const activeChatbotUsersVal = dashboardData?.overview?.active_users_today != null
    ? dashboardData.overview.active_users_today.toLocaleString()
    : '0'

  // 4. Avg Questions / Session Card
  const avgQuestionsSessionVal = chatbotData?.avg_conversation_length != null
    ? chatbotData.avg_conversation_length.toFixed(1)
    : '0.0'

  // 5. Conversation Trends Line Graph Data
  const lineData = (dashboardData?.charts?.chatbot_usage_trend && dashboardData.charts.chatbot_usage_trend.length > 0)
    ? dashboardData.charts.chatbot_usage_trend.map((dp: any) => ({
        name: dp.label,
        conversations: dp.value,
        activeUsers: Math.round(dp.value * 0.75),
      }))
    : []

  // 6. Languages Used Pie Chart Data (No Auto-detected)
  const languageData = (chatbotData?.language_distribution && chatbotData.language_distribution.length > 0)
    ? chatbotData.language_distribution
        .filter((l: any) => (l.key || l.name || l.label || '').toLowerCase() !== 'auto-detected')
        .map((l: any) => ({
          name: l.key || l.name || l.label,
          value: l.count !== undefined ? l.count : l.value,
        }))
    : (dashboardData?.user_analytics?.language_distribution && dashboardData.user_analytics.language_distribution.length > 0)
      ? dashboardData.user_analytics.language_distribution
          .filter((l: any) => (l.key || l.name || l.label || '').toLowerCase() !== 'auto-detected')
          .map((l: any) => ({
            name: l.key || l.name || l.label,
            value: l.count !== undefined ? l.count : l.value,
          }))
      : []

  // 7. Avg Response Time
  const avgResponseTimeVal = chatbotData?.avg_response_time_ms != null
    ? `${(chatbotData.avg_response_time_ms / 1000).toFixed(1)} sec`
    : '0.0 sec'

  // 8. Most Common Topics Bar Chart (Replacing "Government Schemes" with "Miscellaneous Things")
  const topicsData = (chatbotData?.most_asked_questions && chatbotData.most_asked_questions.length > 0)
    ? chatbotData.most_asked_questions.slice(0, 7).map((q: any) => {
        let topicName = q.question || q.topic || q.name || 'Miscellaneous Things'
        if (topicName.toLowerCase().includes('scheme') || topicName.toLowerCase().includes('government')) {
          topicName = 'Miscellaneous Things'
        }
        return {
          name: topicName,
          count: q.count || 0,
        }
      })
    : [
        { name: 'Crop Recommendation', count: 0 },
        { name: 'Weather', count: 0 },
        { name: 'Fertilizer', count: 0 },
        { name: 'Pest Management', count: 0 },
        { name: 'Soil Classification', count: 0 },
        { name: 'Irrigation', count: 0 },
        { name: 'Miscellaneous Things', count: 0 },
      ]

  // Lock background scroll when conversation modal is open (locks main, body, and html)
  useEffect(() => {
    if (selectedConversation) {
      const mainEl = document.querySelector('main')
      const origBodyOverflow = document.body.style.overflow
      const origHtmlOverflow = document.documentElement.style.overflow
      const origMainOverflow = mainEl ? mainEl.style.overflow : ''

      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (mainEl) mainEl.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = origBodyOverflow
        document.documentElement.style.overflow = origHtmlOverflow
        if (mainEl) mainEl.style.overflow = origMainOverflow
      }
    }
  }, [selectedConversation])

  // Escape key support for conversation modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedConversation) {
        setSelectedConversation(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedConversation])

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in relative">
      {/* Conversation Details Modal */}
      {selectedConversation && createPortal(
        <div className={isDark ? 'dark-mode' : ''}>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedConversation(null)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div
              className="bg-surface rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-border flex items-center justify-between bg-background/50">
                <h3 className="font-bold text-lg text-text-primary">Conversation Details</h3>
                <button onClick={() => setSelectedConversation(null)} className="p-2 hover:bg-surface rounded-lg transition-colors"><X size={20} className="text-text-muted" /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-text-muted">User & Role</p>
                    <p className="font-medium text-text-primary">{selectedConversation.user} <span className="text-xs ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{selectedConversation.role}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-muted">Conversation ID</p>
                    <p className="font-mono text-sm text-text-primary">{selectedConversation.conversation_id || selectedConversation.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-muted">Email Address</p>
                    <p className="font-medium text-text-primary">{selectedConversation.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-muted">Location</p>
                    <p className="font-medium text-text-primary">{selectedConversation.district || 'Ludhiana'}, {selectedConversation.state || 'Punjab'}, {selectedConversation.country || 'India'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-muted">Topic & Preferred Language</p>
                    <p className="font-medium text-text-primary">{selectedConversation.topic} · {selectedConversation.lang}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-muted">AI Processing Time</p>
                    <p className="font-medium text-text-primary">{selectedConversation.responseTime}</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="bg-background rounded-xl p-4 ml-8 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-text-secondary">User Question</span>
                      <span className="text-xs text-text-muted">{selectedConversation.date || selectedConversation.time}</span>
                    </div>
                    <p className="text-sm text-text-primary">{selectedConversation.q}</p>
                  </div>
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 mr-8 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1"><Bot size={14} /> AgroAI Response</span>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {selectedConversation.answer || selectedConversation.ai_response || 'Based on agricultural best practices, optimal conditions have been provided for your crop query.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Chatbot Monitoring</h2>
          <p className="text-sm text-text-muted">Real-time metrics and conversation logs</p>
        </div>
        <SelectInput 
          options={[{label:'Today',value:'Today'},{label:'Last 7 Days',value:'Last 7 Days'},{label:'Last 30 Days',value:'Last 30 Days'}]} 
          value={timeRange} 
          onChange={e=>setTimeRange(e.target.value)} 
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Conversations', value: totalConversationsVal, trend: '+12%', up: true, icon: <MessageSquare size={20} className="text-blue-500" /> },
          { title: 'Questions Today', value: questionsTodayVal, trend: '+5%', up: true, icon: <Bot size={20} className="text-green-500" /> },
          { title: 'Active Chatbot Users', value: activeChatbotUsersVal, trend: '+18%', up: true, icon: <User size={20} className="text-purple-500" /> },
          { title: 'Avg Questions/Session', value: avgQuestionsSessionVal, trend: '-2%', up: false, icon: <TrendingUp size={20} className="text-orange-500" /> }
        ].map((kpi, i) => (
          <div key={i} className="bg-surface rounded-2xl p-5 shadow-card border border-border flex flex-col justify-between hover:shadow-elevated transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-background rounded-xl">{kpi.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <h4 className="text-text-muted text-sm font-medium mb-1">{kpi.title}</h4>
              <span className="text-2xl font-bold text-text-primary">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-bold text-text-primary mb-6">Conversation Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #334155', backgroundColor: '#1E293B', color: '#F8FAFC', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                itemStyle={{ color: '#F8FAFC' }}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="conversations" name="Conversations" stroke="#3B82F6" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
              <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#10B981" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface rounded-2xl p-5 shadow-card border border-border flex flex-col">
          <h3 className="font-bold text-text-primary mb-2">Languages Used</h3>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={languageData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {languageData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #334155', backgroundColor: '#1E293B', color: '#F8FAFC', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: '#F8FAFC' }}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-background rounded-xl border border-border flex justify-between items-center">
            <div>
              <p className="text-xs text-text-muted">Avg Response Time</p>
              <p className="text-lg font-bold text-text-primary">{avgResponseTimeVal}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Bot size={20} />
            </div>
          </div>
        </div>

        {/* Most Common Topics (PART 11: Clicking topic makes it bold without popup) */}
        <div className="lg:col-span-3 bg-surface rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-bold text-text-primary mb-6">Most Common Topics</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={topicsData}
              layout="vertical"
              margin={{ left: 50, right: 20 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  const clicked = e.activePayload[0].payload.name
                  setSelectedTopic(prev => prev === clicked ? null : clicked)
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={140}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={-10}
                      y={4}
                      textAnchor="end"
                      fill={selectedTopic === payload.value ? '#3B82F6' : '#64748B'}
                      style={{
                        fontSize: '11px',
                        fontWeight: selectedTopic === payload.value ? 'bold' : 'normal',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedTopic(prev => prev === payload.value ? null : payload.value)}
                    >
                      {payload.value}
                    </text>
                  </g>
                )}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #334155', backgroundColor: '#1E293B', color: '#F8FAFC', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                itemStyle={{ color: '#F8FAFC' }}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={24} name="Inquiries" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bot Activity Table (Conversation Date column & click expansion) */}
      <div className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-text-primary">Recent Bot Activity</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background">
              <Search size={14} className="text-text-muted" />
              <input
                value={searchLogs}
                onChange={e => setSearchLogs(e.target.value)}
                placeholder="Search logs..."
                className="bg-transparent text-xs outline-none text-text-primary placeholder-text-muted"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background border-b border-border">
              <tr>{['Conversation Date', 'User', 'Role', 'Language', 'Question', 'Topic', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs text-text-muted italic">
                    {loading ? 'Loading chatbot logs from PostgreSQL database...' : 'No chatbot activity logs found.'}
                  </td>
                </tr>
              ) : (
                recentLogs.map((r, i) => (
                  <tr key={i} onClick={() => setSelectedConversation(r)} className="border-b border-border hover:bg-background transition-colors cursor-pointer group">
                    <td className="py-3 px-4 text-xs text-text-muted whitespace-nowrap">{r.date || r.time}</td>
                    <td className="py-3 px-4 font-medium text-text-primary">{r.user}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${r.role === 'Farmer' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{r.role}</span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-xs">{r.lang}</td>
                    <td className="py-3 px-4 text-text-primary max-w-xs truncate" title={r.q}>{r.q}</td>
                    <td className="py-3 px-4 text-text-secondary text-xs">{r.topic}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Resolved' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'Resolved' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


function AdminUserManagement({ isDark = false }: { isDark?: boolean }) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const [userList, setUserList] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [addError, setAddError] = useState('')

  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: 'India',
    state: 'Punjab',
    district: 'Ludhiana',
    lang: 'English',
    role: 'Farmer',
  })

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Debounce search input (250ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(timer)
  }, [search])

  // Single Source of Truth: Fetch users directly from PostgreSQL database via API
  const loadUsersFromBackend = async () => {
    try {
      setLoadingUsers(true)
      const res = await adminAPI.getUsersList({
        search: debouncedSearch || undefined,
        role: roleFilter !== 'All' ? roleFilter : undefined,
        status_filter: statusFilter !== 'All' ? statusFilter : undefined,
      })

      if (res && res.users) {
        // Alphabetical A -> Z sorting by full name
        const sorted = [...res.users].sort((a: any, b: any) =>
          (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
        )
        setUserList(sorted)
        setTotalCount(res.total ?? sorted.length)
      } else {
        setUserList([])
        setTotalCount(0)
      }
    } catch (err) {
      console.error('Error fetching PostgreSQL users from backend:', err)
      setUserList([])
    } finally {
      setLoadingUsers(false)
    }
  }

  // Reload database users whenever search, roleFilter, or statusFilter changes
  useEffect(() => {
    loadUsersFromBackend()
  }, [debouncedSearch, roleFilter, statusFilter])

  // Lock background scroll when any drawer or modal is open (locks main, body, and html)
  const isAnyModalOpen = showAddModal || showEditModal || showDeleteModal || showDetailModal
  useEffect(() => {
    if (isAnyModalOpen) {
      const mainEl = document.querySelector('main')
      const origBodyOverflow = document.body.style.overflow
      const origHtmlOverflow = document.documentElement.style.overflow
      const origMainOverflow = mainEl ? mainEl.style.overflow : ''

      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (mainEl) mainEl.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = origBodyOverflow
        document.documentElement.style.overflow = origHtmlOverflow
        if (mainEl) mainEl.style.overflow = origMainOverflow
      }
    }
  }, [isAnyModalOpen])

  // Escape key support to close any open drawer or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAnyModalOpen) {
        setShowAddModal(false)
        setShowEditModal(false)
        setShowDeleteModal(false)
        setShowDetailModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnyModalOpen])

  // 1. Add User (PostgreSQL Registration API integration)
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')

    if (!addForm.name || !addForm.email || !addForm.password || !addForm.confirmPassword || !addForm.country || !addForm.state || !addForm.district) {
      setAddError('Please fill in all required fields.')
      return
    }
    if (addForm.password !== addForm.confirmPassword) {
      setAddError('Password and Confirm Password do not match.')
      return
    }
    if (!addForm.email.includes('@')) {
      setAddError('Please enter a valid email address.')
      return
    }

    try {
      const payload = {
        username: addForm.name,
        email: addForm.email,
        password: addForm.password,
        confirm_password: addForm.confirmPassword,
        phone_number: addForm.phone || undefined,
        country: addForm.country,
        state: addForm.state,
        district: addForm.district,
        preferred_language: addForm.lang,
        role: addForm.role.toLowerCase(),
      }
      await apiClient.post('/auth/register', payload)

      setShowAddModal(false)
      setAddForm({
        name: '', email: '', phone: '', password: '', confirmPassword: '',
        country: 'India', state: 'Punjab', district: 'Ludhiana', lang: 'English', role: 'Farmer'
      })
      showToast('User created successfully in database.')
      // Refresh live PostgreSQL user list
      await loadUsersFromBackend()
    } catch (err: any) {
      console.error('Failed to create user in backend:', err)
      const msg = err.response?.data?.detail || 'Failed to create user. Email may already be registered.'
      setAddError(msg)
    }
  }

  // 2. Promote Farmer -> Admin API Call
  const handlePromote = async () => {
    if (!selectedUser) return
    try {
      await adminAPI.updateUserRole(selectedUser.id, 'admin')
      showToast('User promoted to Admin.')
      setShowEditModal(false)
      await loadUsersFromBackend()
    } catch (err: any) {
      console.error('Failed to update role on backend:', err)
      showToast(err.response?.data?.detail || 'Failed to update role.')
    }
  }

  // 3. Deactivate / Status Update API Call
  const handleDeactivate = async () => {
    if (!selectedUser) return
    try {
      await adminAPI.updateUserStatus(selectedUser.id, { is_active: false, is_blocked: true })
      showToast('User account deactivated.')
      setShowEditModal(false)
      await loadUsersFromBackend()
    } catch (err: any) {
      console.error('Failed to update user status on backend:', err)
      showToast(err.response?.data?.detail || 'Failed to deactivate account.')
    }
  }

  // 4. Delete User API Call
  const handleDelete = async () => {
    if (!selectedUser) return
    try {
      await adminAPI.deleteUser(selectedUser.id)
      showToast('User deleted from database.')
      setShowDeleteModal(false)
      await loadUsersFromBackend()
    } catch (err: any) {
      console.error('Failed to delete user from backend:', err)
      showToast(err.response?.data?.detail || 'Failed to delete user.')
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in relative">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50 text-green-800 shadow-elevated animate-fade-in">
          <span className="text-sm font-medium">✅ {toastMsg}</span>
          <button onClick={() => setToastMsg('')} className="text-xs opacity-60 hover:opacity-100 ml-2"><X size={14} /></button>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && createPortal(
        <div className={isDark ? 'dark-mode' : ''}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-surface rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between bg-background/50">
              <h3 className="font-bold text-lg text-text-primary">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface rounded-lg transition-colors"><X size={20} className="text-text-muted" /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 overflow-y-auto space-y-4">
              {addError && (
                <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl">
                  ⚠️ {addError}
                </div>
              )}
              <Input label="Full Name *" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} placeholder="e.g. Gurpreet Singh" />
              <Input label="Email Address *" type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} placeholder="gurpreet@farm.com" />
              <Input label="Phone Number" value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} placeholder="+91 9876543210" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Password *" type="password" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} placeholder="••••••••" />
                <Input label="Confirm Password *" type="password" value={addForm.confirmPassword} onChange={e => setAddForm({...addForm, confirmPassword: e.target.value})} placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Country *" value={addForm.country} onChange={e => setAddForm({...addForm, country: e.target.value})} />
                <Input label="State *" value={addForm.state} onChange={e => setAddForm({...addForm, state: e.target.value})} />
                <Input label="District *" value={addForm.district} onChange={e => setAddForm({...addForm, district: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SelectInput label="Preferred Language" options={[{label:'English',value:'English'},{label:'Hindi',value:'Hindi'},{label:'Punjabi',value:'Punjabi'},{label:'Tamil',value:'Tamil'},{label:'Telugu',value:'Telugu'}]} value={addForm.lang} onChange={e => setAddForm({...addForm, lang: e.target.value})} />
                <SelectInput label="Role" options={[{label:'Farmer',value:'Farmer'},{label:'Admin',value:'Admin'}]} value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit" className="flex-1 justify-center">Create User</Button>
              </div>
            </form>
          </div>
        </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && createPortal(
        <div className={isDark ? 'dark-mode' : ''}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-surface rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in p-6 text-center"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-red-600" size={32} />
            </div>
            <h3 className="font-bold text-xl text-text-primary mb-2">Delete User</h3>
            <p className="text-sm text-text-secondary mb-6">This action cannot be undone. Are you sure you want to delete <strong>{selectedUser?.name}</strong>?</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1 justify-center bg-red-600 hover:bg-red-700 border-red-600 text-white" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
        </div>,
        document.body
      )}

      {/* Edit User Modal (Read-Only Info & Role Promotion ONLY) */}
      {showEditModal && selectedUser && createPortal(
        <div className={isDark ? 'dark-mode' : ''}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-surface rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between bg-background/50">
              <h3 className="font-bold text-lg text-text-primary">User Profile & Controls</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-surface rounded-lg transition-colors"><X size={20} className="text-text-muted" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2"><User size={16}/> User Details (Read-Only)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={selectedUser.name} disabled />
                  <Input label="Email Address" value={selectedUser.email} disabled />
                  <Input label="Phone Number" value={selectedUser.phone} disabled />
                  <Input label="Location (Region)" value={selectedUser.region} disabled />
                  <Input label="Preferred Language" value={selectedUser.lang} disabled />
                  <Input label="Current Status" value={selectedUser.status} disabled />
                </div>
              </div>

              <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 space-y-4 dark:bg-red-950/20 dark:border-red-900/30">
                <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Administrative Controls</h4>
                {selectedUser.role !== 'Admin' ? (
                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-900/60 rounded-lg border border-red-100 dark:border-red-900/30">
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-400 text-sm">Role Promotion</p>
                      <p className="text-xs text-red-600 dark:text-red-400">Grant full access to AgroAI admin dashboard</p>
                    </div>
                    <Button variant="primary" className="bg-red-600 hover:bg-red-700 border-red-600 text-white" onClick={handlePromote}>Promote to Admin</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-lg border border-purple-100 dark:border-purple-900/30">
                    <div>
                      <p className="font-semibold text-purple-800 dark:text-purple-300 text-sm">Admin Privileges Active</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">User is already a System Administrator</p>
                    </div>
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">Admin</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-900/60 rounded-lg border border-red-100 dark:border-red-900/30">
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-400 text-sm">Account Status Control</p>
                    <p className="text-xs text-red-600 dark:text-red-400">Deactivate this user account</p>
                  </div>
                  <Button variant="secondary" className="border-red-200 text-red-700 hover:bg-red-50" onClick={handleDeactivate}>Deactivate</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>,
        document.body
      )}

      {/* User Detail Drawer */}
      {showDetailModal && selectedUser && createPortal(
        <div className={isDark ? 'dark-mode' : ''}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
          onClick={() => setShowDetailModal(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-surface w-full max-w-md h-full shadow-2xl animate-fade-in-up flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-lg text-text-primary">User Overview</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-surface rounded-lg transition-colors"><X size={20} className="text-text-muted" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex flex-col items-center text-center pb-6 border-b border-border">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-sm">
                  {selectedUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <h2 className="text-xl font-bold text-text-primary">{selectedUser.name}</h2>
                <p className="text-sm text-text-muted mb-2">{selectedUser.email}</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${selectedUser.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{selectedUser.role}</span>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide">Account Details</h4>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div><p className="text-text-muted text-xs">Phone</p><p className="font-medium text-text-primary">{selectedUser.phone}</p></div>
                  <div><p className="text-text-muted text-xs">Location</p><p className="font-medium text-text-primary">{selectedUser.region}</p></div>
                  <div><p className="text-text-muted text-xs">Language</p><p className="font-medium text-text-primary">{selectedUser.lang}</p></div>
                  <div><p className="text-text-muted text-xs">Status</p><p className="font-medium text-text-primary">{selectedUser.status}</p></div>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide">Platform Usage</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <p className="text-2xl font-bold text-text-primary">{selectedUser.analyses}</p>
                    <p className="text-xs text-text-muted mt-1">Total Predictions</p>
                  </div>
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <p className="text-2xl font-bold text-text-primary">{selectedUser.chatbot}</p>
                    <p className="text-xs text-text-muted mt-1">Chatbot Inquiries</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 text-sm pt-2">
                  <div><p className="text-text-muted text-xs">Join Date</p><p className="font-medium text-text-primary">{selectedUser.joined}</p></div>
                  <div><p className="text-text-muted text-xs">Last Login</p><p className="font-medium text-text-primary">{selectedUser.lastLogin}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>,
        document.body
      )}

      {/* Header & Add User Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">User Management</h2>
          <p className="text-sm text-text-muted">{totalCount} registered users</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          + Add User
        </button>
      </div>

      {/* Search & Combined Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border focus-within:border-text-muted focus-within:ring-2 focus-within:ring-text-muted/25 transition-all duration-200 bg-surface flex-1">
          <Search size={16} className="text-text-muted flex-shrink-0" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search by name, email, or phone..."
            className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted outline-none" 
          />
        </div>
        <div className="flex gap-3">
          <SelectInput 
            options={[{label:'All Roles',value:'All'},{label:'Farmer',value:'Farmer'},{label:'Admin',value:'Admin'}]}
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          />
          <SelectInput 
            options={[{label:'All Status',value:'All'},{label:'Active',value:'active'},{label:'Pending',value:'pending'},{label:'Suspended',value:'suspended'},{label:'Inactive',value:'inactive'}]}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-background border-b border-border">
            <tr>{['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
              <th key={h} className="py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {userList.map((u, i) => (
              <tr
                key={u.id ? `user-${u.id}` : `user-row-${i}`}
                className="border-b border-border hover:bg-background transition-colors cursor-pointer"
                onClick={() => { setSelectedUser(u); setShowDetailModal(true); }}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                      {(u.name || 'User').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{u.name}</p>
                      <p className="text-[10px] text-text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    u.role === 'Farmer' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>{u.role}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    u.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200'
                    : u.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-200'
                    : 'bg-background text-text-secondary border border-border'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1 ${u.status === 'active' ? 'bg-green-500' : u.status === 'pending' ? 'bg-orange-500' : 'bg-gray-400'}`}></span>
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-text-muted">{u.joined}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setSelectedUser(u); setShowEditModal(true); }} className="px-3 py-1.5 rounded-lg border border-border hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 text-xs font-medium transition-colors text-text-secondary">Edit</button>
                    <button onClick={() => { setSelectedUser(u); setShowDeleteModal(true); }} className="px-3 py-1.5 rounded-lg bg-red-600 border border-red-600 text-white shadow-sm hover:bg-red-700 hover:border-red-700 hover:shadow active:scale-[0.98] text-xs font-medium transition-all">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {userList.length === 0 && (
          <div className="p-8 text-center text-text-muted text-sm">
            {loadingUsers ? 'Loading registered users from PostgreSQL...' : 'No users found matching your criteria.'}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('Last 7 Days')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const data = await adminAPI.getAnalyticsDashboard({ range_filter: dateRange })
        if (isMounted) {
          setAnalytics(data)
        }
      } catch (err) {
        console.error("Failed to load admin analytics dashboard:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchAnalytics()
    return () => { isMounted = false }
  }, [dateRange])

  const predictionsAndUserGrowth = analytics?.predictions_and_user_growth || []
  const soilData = analytics?.soil_distribution || []
  const languageData = analytics?.languages_used || []
  const cropData = analytics?.recommended_crops || []
  const nutrientData = analytics?.nutrient_deficiencies || []
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B', '#06B6D4']

  const renderChart = (data: any, children: React.ReactNode, height = 220) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-text-muted text-sm gap-2" style={{ height: `${height}px` }}>
          <LineSpinner />
          <span>Loading analytics from PostgreSQL...</span>
        </div>
      )
    }
    if (!data || data.length === 0) {
      return <div className={`flex items-center justify-center text-text-muted text-sm`} style={{ height: `${height}px` }}>No analytics data available.</div>
    }
    return (
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Analytics & Reports</h2>
          <p className="text-sm text-text-muted">Platform-wide usage and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-text-muted" />
          <SelectInput 
            options={[
              {label: 'Today', value: 'Today'}, 
              {label: 'Last 7 Days', value: 'Last 7 Days'}, 
              {label: 'Last 30 Days', value: 'Last 30 Days'}, 
              {label: 'Custom Range', value: 'Custom'}
            ]}
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-bold text-text-primary mb-4">Predictions Over Time</h3>
          {renderChart(predictionsAndUserGrowth, (
            <AreaChart data={predictionsAndUserGrowth} margin={{ left: -20 }}>
              <defs><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/><stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="predictions" stroke="#2E7D32" strokeWidth={2} fill="url(#grad1)" name="Predictions" />
            </AreaChart>
          ))}
        </div>

        <div className="bg-surface rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-bold text-text-primary mb-4">User Growth</h3>
          {renderChart(predictionsAndUserGrowth, (
            <BarChart data={predictionsAndUserGrowth} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="users" fill="#1565C0" radius={[6, 6, 0, 0]} name="Users" />
            </BarChart>
          ))}
        </div>
        
        <div className="bg-surface rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-bold text-text-primary mb-4">Soil Type Distribution</h3>
          {renderChart(soilData, (
            <PieChart>
              <Pie data={soilData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {soilData.map((_, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          ))}
        </div>

        <div className="bg-surface rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-bold text-text-primary mb-4">Languages Used (Platform)</h3>
          {renderChart(languageData, (
            <PieChart>
              <Pie data={languageData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {languageData.map((_, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          ))}
        </div>

        <div className="bg-surface rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-bold text-text-primary mb-4">Most Recommended Crops</h3>
          {renderChart(cropData, (
            <BarChart data={cropData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#2E7D32" radius={[0, 4, 4, 0]} barSize={20} name="Recommendations" />
            </BarChart>
          ), 240)}
        </div>

        <div className="bg-surface rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-bold text-text-primary mb-4">Nutrient Deficiency Statistics</h3>
          {renderChart(nutrientData, (
            <BarChart data={nutrientData} layout="vertical" margin={{ left: 40, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={20} name="Deficiency Count" />
            </BarChart>
          ), 240)}
        </div>
      </div>
    </div>
  )
}

function AdminReports() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportFormat, setReportFormat] = useState('PDF')
  const [reportsList, setReportsList] = useState([
    { title: 'Monthly Platform Report — July 2026', type: 'Platform', date: 'Jul 25, 2026', size: '2.4 MB' },
    { title: 'AI Model Performance Q2 2026', type: 'AI/ML', date: 'Jun 30, 2026', size: '4.1 MB' },
    { title: 'User Engagement Analysis H1 2026', type: 'Analytics', date: 'Jun 30, 2026', size: '3.8 MB' },
    { title: 'Security Audit Report July 2026', type: 'Security', date: 'Jul 20, 2026', size: '1.2 MB' },
    ...(FEATURES.DISEASE_DETECTION ? [{ title: 'Disease Detection Accuracy Report', type: 'AI/ML', date: 'Jul 15, 2026', size: '5.6 MB' }] : [{ title: 'Crop Recommendation Accuracy Report', type: 'AI/ML', date: 'Jul 15, 2026', size: '5.6 MB' }]),
  ])
  
  const [sections, setSections] = useState<string[]>(['Charts', 'Statistics'])
  const toggleSection = (s: string) => setSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setReportsList([{ title: 'Custom Generated Report', type: 'Custom', date: 'Just now', size: '1.8 MB' }, ...reportsList])
    }, 1500)
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Report Generation Center</h2>
          <p className="text-sm text-text-muted">Create, manage and export comprehensive platform reports</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6 flex-1 overflow-hidden pb-10">
        {/* Report Generator Panel */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto custom-scrollbar pr-1">
          <div className="bg-surface rounded-2xl shadow-card border border-border p-5">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2"><FileText size={16} className="text-blue-500"/> Configure Report</h3>
            
            <div className="space-y-4">
              <SelectInput label="Report Type" options={['User Activity Report', 'Soil Analysis Report', 'Crop Recommendation Report', 'Fertilizer Recommendation Report', 'Weather Analytics Report', 'Chatbot Usage Report', 'Community Activity Report', 'Feedback Report', 'Overall Platform Report'].map(o => ({label: o, value: o}))} value="Overall Platform Report" onChange={()=>{}} />
              
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Date" type="date" defaultValue="2026-07-01" />
                <Input label="End Date" type="date" defaultValue="2026-07-28" />
              </div>
              
              <div>
                <p className="text-xs font-semibold text-text-primary mb-2">Export Format</p>
                <div className="flex gap-2">
                  {['PDF', 'Excel', 'CSV'].map(f => (
                    <button key={f} onClick={() => setReportFormat(f)} className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors ${reportFormat === f ? 'bg-primary-50 text-primary-700 border-primary-300' : 'bg-background text-text-secondary border-border hover:border-text-muted'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-primary mb-2">Include Sections</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Charts', 'Statistics', 'User Details', 'Recommendations', 'AI Insights'].map(s => (
                    <label key={s} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs font-medium select-none ${sections.includes(s) ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-border text-text-secondary hover:border-border bg-background'}`}>
                      <input type="checkbox" checked={sections.includes(s)} onChange={() => toggleSection(s)} className="accent-blue-600 w-3.5 h-3.5 flex-shrink-0" />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="primary" className="w-full justify-center py-3" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? <><LineSpinner size={16} color="white" strokeWidth={2}/> Generating...</> : 'Generate Report'}
                </Button>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border space-y-2">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Report Summary</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div><p className="text-text-muted text-[10px] uppercase">Last Generated</p><p className="font-medium text-text-primary text-xs">Today, 10:45 AM</p></div>
                <div><p className="text-text-muted text-[10px] uppercase">Generated By</p><p className="font-medium text-text-primary text-xs">System Admin</p></div>
                <div><p className="text-text-muted text-[10px] uppercase">Est. Size</p><p className="font-medium text-text-primary text-xs">~2.5 MB</p></div>
                <div><p className="text-text-muted text-[10px] uppercase">Status</p><p className="font-medium text-green-600 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Ready</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports Panel */}
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-card border border-border p-5 flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
            <h3 className="font-bold text-text-primary">Recent Reports</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input placeholder="Search reports..." className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:border-green-500 outline-none w-full sm:w-48" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-surface text-xs font-medium text-text-secondary"><Filter size={14}/> Filter</button>
            </div>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {reportsList.map((r, i) => (
              <div key={i} className="bg-background rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-soft transition-all-smooth group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.type === 'Security' ? 'bg-red-100 text-red-600' : r.type === 'AI/ML' ? 'bg-purple-100 text-purple-600' : r.type === 'Custom' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary text-sm truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${r.type === 'Security' ? 'bg-red-50 text-red-700' : r.type === 'AI/ML' ? 'bg-purple-50 text-purple-700' : r.type === 'Custom' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{r.type}</span>
                      <span className="text-xs text-text-muted">• {r.date} • {r.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-auto ml-13 sm:ml-0 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button className="p-1.5 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View"><Eye size={14}/></button>
                  <button className="p-1.5 text-text-muted hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                  <button className="p-1.5 text-text-muted hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Regenerate"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></button>
                  <button className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><X size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
