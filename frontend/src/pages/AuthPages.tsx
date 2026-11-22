import { useState } from 'react'
import { Leaf, Eye, EyeOff, Mail, Lock, User, Phone, ChevronRight, ChevronLeft, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button, Input, SelectInput } from '../components/ui'
import { authAPI } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import { LOCATION_DATA, SUPPORTED_LANGUAGES } from '../data/locationData'

type AuthPage = 'login' | 'register' | 'forgot'

interface AuthPagesProps {
  onLogin: (role: 'farmer' | 'admin') => void
  onBack: () => void
  initialPage?: AuthPage
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Special char', ok: /[!@#$%^&*]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  return (
    <div>
      <div className="flex gap-1 mb-2">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < score ? colors[score - 1] : 'bg-background'}`} />
        ))}
      </div>
      {password && <p className="text-xs text-text-muted">Strength: <span className="font-semibold">{labels[score - 1] || 'Very Weak'}</span></p>}
    </div>
  )
}

function LoginForm({ onLogin, onForgot, onRegister }: { onLogin: (role: 'farmer' | 'admin') => void; onForgot: () => void; onRegister: () => void }) {
  const { login } = useAuth()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await authAPI.login({ email, password })
      localStorage.setItem('access_token', response.access_token)
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token)
      }
      
      const userData = await authAPI.me()
      login(response.access_token, userData)
      onLogin(userData.role === 'admin' || userData.is_admin ? 'admin' : 'farmer')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials or network error.')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
        <p className="text-sm text-text-muted mt-1">Sign in to your AgroAI account</p>
      </div>

      <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" icon={<Mail size={15} />} />

      <div className="flex flex-col gap-1.5">
        <Input 
          label="Password"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          icon={<Lock size={15} />}
        />
        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-text-muted hover:text-text-secondary">
          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      <div className="flex items-center justify-between mt-1">
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input type="checkbox" className="rounded border-border accent-primary-600" />
          Remember me
        </label>
        <button type="button" onClick={onForgot} className="text-sm font-semibold text-primary-700 hover:text-primary-800">Forgot password?</button>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full justify-center mt-2">
        Sign In
      </Button>

      <div className="relative mt-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center"><span className="bg-surface px-3 text-xs text-text-muted">or</span></div>
      </div>

      <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-text-primary hover:bg-background transition-all-smooth">
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <p className="text-center text-sm text-text-muted mt-2">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onRegister} className="font-semibold text-primary-700 hover:text-primary-800">Create account</button>
      </p>
    </form>
  )
}

function RegisterForm({ onLogin }: { onSuccess?: () => void; onLogin: () => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', country: 'India', state: '', district: '', village: '', language: '1', terms: false, privacy: false })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [step1Attempted, setStep1Attempted] = useState(false)
  const [step2Attempted, setStep2Attempted] = useState(false)

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  // Cascading location options
  const countryOptions = [
    { value: '', label: '— Select Country —' },
    ...Object.keys(LOCATION_DATA).map(c => ({ value: c, label: c }))
  ]
  const availableStates = form.country && LOCATION_DATA[form.country] ? Object.keys(LOCATION_DATA[form.country]) : []
  const stateOptions = [
    { value: '', label: '— Select State —' },
    ...availableStates.map(s => ({ value: s, label: s }))
  ]
  const availableDistricts = form.country && form.state && LOCATION_DATA[form.country]?.[form.state] ? LOCATION_DATA[form.country][form.state] : []
  const districtOptions = [
    { value: '', label: '— Select District —' },
    ...availableDistricts.map(d => ({ value: d, label: d }))
  ]

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    set('country', e.target.value)
    set('state', '')
    set('district', '')
    set('village', '')
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    set('state', e.target.value)
    set('district', '')
    set('village', '')
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    set('district', e.target.value)
    set('village', '')
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Step 1 computed errors (shown only after user attempts to continue)
  const nameErr = step1Attempted && !form.name.trim() ? 'Full name is required.' : ''
  const emailErr = step1Attempted
    ? (!form.email.trim() ? 'Email address is required.' : !emailRe.test(form.email) ? 'Please enter a valid email address.' : '')
    : ''
  const passwordErr = step1Attempted
    ? (!form.password ? 'Password is required.' : form.password.length < 8 ? 'Password must contain at least 8 characters.' : '')
    : ''
  const confirmErr = step1Attempted
    ? (!form.confirm ? 'Please confirm your password.' : form.confirm !== form.password ? 'Passwords do not match.' : '')
    : ''

  const step1Valid =
    form.name.trim().length > 0 &&
    emailRe.test(form.email) &&
    form.password.length >= 8 &&
    form.confirm.length > 0 &&
    form.confirm === form.password

  // Step 2 requires country, state, and district
  const step2Valid = form.country.trim().length > 0 && form.state.trim().length > 0 && form.district.trim().length > 0

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep1Attempted(true)
    if (step1Valid) setStep(2)
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep2Attempted(true)
    if (step2Valid) setStep(3)
  }

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!form.terms || !form.privacy) return
    setLoading(true)
    try {
      const langId = Number(form.language) || 1
      await authAPI.register({
        username: form.name,
        email: form.email,
        password: form.password,
        confirm_password: form.confirm,
        role: 'farmer',
        is_admin: false,
        country: form.country,
        state: form.state,
        district: form.district,
        preferred_language: langId
      })
      setDone(true)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
        <CheckCircle2 size={32} className="text-primary-600" />
      </div>
      <h3 className="text-xl font-bold text-text-primary">Account Created!</h3>
      <p className="text-sm text-text-muted text-center">Welcome to AgroAI. Your account has been successfully created.</p>
      <Button variant="primary" size="lg" onClick={onLogin} className="mt-2">Sign In Now</Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center mb-1">
        <h2 className="text-2xl font-bold text-text-primary">Create Account</h2>
        <p className="text-sm text-text-muted mt-1">Step {step} of 3 — {['Basic Info', 'Location', 'Terms & Confirm'][step - 1]}</p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-green-500' : 'bg-background'}`} />
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="flex flex-col gap-4 animate-fade-in">
          <Input label="Full Name" required error={nameErr} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" icon={<User size={15} />} />
          <Input label="Email Address" type="email" required error={emailErr} value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" icon={<Mail size={15} />} />
          <Input label="Phone Number" hint="(Optional)" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" icon={<Phone size={15} />} />
          
          <div className="flex flex-col gap-1.5 relative">
            <Input label="Password" required error={passwordErr} type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" icon={<Lock size={15} />} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-text-muted hover:text-text-secondary">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            {form.password && !passwordErr && <PasswordStrength password={form.password} />}
          </div>

          <Input label="Confirm Password" required error={confirmErr} type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Re-enter password" icon={<Lock size={15} />} />

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            icon={<ChevronRight size={15} />}
          >
            Continue
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="flex flex-col gap-4 animate-fade-in">
          <SelectInput
            label="Country"
            value={form.country}
            onChange={handleCountryChange}
            options={countryOptions}
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectInput
              label="State"
              value={form.state}
              onChange={handleStateChange}
              options={stateOptions}
            />
            <SelectInput
              label="District"
              value={form.district}
              onChange={handleDistrictChange}
              options={districtOptions}
            />
          </div>
          <Input
            label="Village / City"
            value={form.village}
            onChange={e => set('village', e.target.value)}
            placeholder="e.g. Kotkapura"
          />
          <SelectInput
            label="Preferred Language"
            value={form.language}
            onChange={e => set('language', e.target.value)}
            options={SUPPORTED_LANGUAGES.map(l => ({ value: String(l.id), label: `${l.native} (${l.name})` }))}
          />
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)} icon={<ChevronLeft size={15} />}>Back</Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 justify-center"
              icon={<ChevronRight size={15} />}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4 animate-fade-in">
          <div className="bg-background rounded-xl p-4 text-sm text-text-secondary leading-relaxed">
            <p className="font-semibold text-text-primary mb-2">Terms of Service</p>
            <p className="text-xs">By creating an account, you agree that AgroAI may use your agricultural data to improve AI models. Data is anonymized and never shared with third parties without consent.</p>
          </div>
          <div className="bg-background rounded-xl p-4 text-sm text-text-secondary leading-relaxed">
            <p className="font-semibold text-text-primary mb-2">Privacy Policy</p>
            <p className="text-xs">We collect field data, predictions, and usage logs under GDPR compliance. You retain full ownership and can export or delete your data at any time.</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} className="mt-0.5 accent-green-600" />
              <span className="text-sm text-text-secondary">I agree to the <span className="text-green-700 font-medium">Terms of Service</span></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.privacy} onChange={e => set('privacy', e.target.checked)} className="mt-0.5 accent-green-600" />
              <span className="text-sm text-text-secondary">I agree to the <span className="text-green-700 font-medium">Privacy Policy</span></span>
            </label>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(2)} icon={<ChevronLeft size={15} />}>Back</Button>
            <Button type="submit" variant="primary" loading={loading} disabled={!form.terms || !form.privacy} className="flex-1 justify-center">Create Account</Button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-text-muted">
        Already have an account?{' '}
        <button type="button" onClick={onLogin} className="font-semibold text-green-700 hover:text-green-800">Sign in</button>
      </p>
    </div>
  )
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [pw, setPw] = useState('')

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setStep('otp')
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.trim()) setStep('reset')
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw.trim() && pw.length >= 8) setStep('done')
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center mb-1">
        <h2 className="text-2xl font-bold text-text-primary">Reset Password</h2>
        <p className="text-sm text-text-muted mt-1">We&apos;ll send a verification code to your email</p>
      </div>

      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 animate-fade-in">
          <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" icon={<Mail size={15} />} />
          <Button type="submit" variant="primary" className="w-full justify-center">Send OTP Code</Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4 animate-fade-in">
          <p className="text-sm text-text-muted text-center">Enter the 6-digit code sent to <strong>{email || 'your email'}</strong></p>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6} className="w-full text-center py-3 rounded-xl border-2 border-border text-xl font-mono tracking-[0.5em] focus:border-text-muted" />
          <Button type="submit" variant="primary" className="w-full justify-center">Verify Code</Button>
          <button type="button" onClick={() => setStep('email')} className="text-sm text-text-muted hover:text-text-secondary text-center">Resend code</button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetSubmit} className="flex flex-col gap-4 animate-fade-in">
          <Input label="New Password" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Min. 8 characters" icon={<Lock size={15} />} />
          {pw && <PasswordStrength password={pw} />}
          <Input label="Confirm Password" type="password" placeholder="Re-enter password" icon={<Lock size={15} />} />
          <Button type="submit" variant="primary" className="w-full justify-center">Reset Password</Button>
        </form>
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center gap-4 py-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Password Reset!</h3>
          <p className="text-sm text-text-muted text-center">Your password has been successfully updated.</p>
          <Button variant="primary" onClick={onBack} className="mt-2">Back to Sign In</Button>
        </div>
      )}

      {step !== 'done' && (
        <button type="button" onClick={onBack} className="flex items-center justify-center gap-1 text-sm text-text-muted hover:text-text-secondary">
          <ArrowLeft size={14} />
          Back to sign in
        </button>
      )}
    </div>
  )
}

export default function AuthPages({ onLogin, onBack, initialPage = 'login' }: AuthPagesProps) {
  const [page, setPage] = useState<AuthPage>(initialPage)

  const illustrations = [
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=900&fit=crop&auto=format',
  ]
  const img = illustrations[page === 'login' ? 0 : 1]

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-green-900">
        <img src={img} alt="Agriculture" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 gradient-hero opacity-75" />
        <div className="relative z-10 flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-surface/20 flex items-center justify-center"><Leaf size={24} className="text-white" /></div>
              <span className="text-2xl font-bold">AgroAI</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">AI-Powered<br />Smart Agriculture</h2>
            <p className="text-white/75 leading-relaxed mb-8">Join thousands of farmers using AI to maximize yields, analyze soils, and make data-driven decisions.</p>
            <div className="grid grid-cols-2 gap-4">
              {[{ v: '98.2%', l: 'AI Accuracy' }, { v: '50K+', l: 'Farmers' }, { v: '12', l: 'Crop Types' }, { v: '10+', l: 'Languages' }].map(s => (
                <div key={s.l} className="bg-surface/10 rounded-xl p-3 border border-white/20">
                  <p className="text-xl font-bold">{s.v}</p>
                  <p className="text-white/65 text-xs">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-xs">© 2026 AgroAI — Enterprise Agriculture AI Platform</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <button onClick={onBack} className="lg:hidden flex items-center gap-1 text-sm text-text-muted mb-6 hover:text-text-secondary">
            <ArrowLeft size={14} /> Back to Home
          </button>
          <div className="bg-surface rounded-2xl shadow-elevated border border-border p-8">
            {page === 'login' && <LoginForm onLogin={onLogin} onForgot={() => setPage('forgot')} onRegister={() => setPage('register')} />}
            {page === 'register' && <RegisterForm onSuccess={() => setPage('login')} onLogin={() => setPage('login')} />}
            {page === 'forgot' && <ForgotForm onBack={() => setPage('login')} />}
          </div>
        </div>
      </div>
    </div>
  )
}
