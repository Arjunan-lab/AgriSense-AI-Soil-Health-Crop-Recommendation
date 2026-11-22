import { Bell, Search, Menu, Sun, Moon, ChevronDown } from 'lucide-react'
import { SearchInput } from './ui'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { formatDisplayName, getInitials, getProfilePictureUrl } from '../utils/formatName'

type Role = 'farmer' | 'admin'

interface NavbarProps {
  role: Role
  page: string
  darkMode: boolean
  onToggleDark: () => void
  onMenuToggle: () => void
  onNavigate: (page: string) => void
  unreadNotifs?: number
}

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  soil: 'Soil Classification',
  crop: 'Crop Recommendation',
  fertilizer: 'Fertilizer Recommendation',
  disease: 'Disease Detection',
  chatbot: 'AI Chatbot',
  weather: 'Weather Dashboard',
  history: 'Prediction History',
  notifications: 'Notifications',
  feedback: 'Feedback',
  profile: 'Profile',
  about: 'About AgroAI',
  settings: 'Settings',
  users: 'User Management',
  analytics: 'Analytics & Reports',
  security: 'Security Logs',
  health: 'System Health',
  reports: 'Reports',
}

const roleColors: Record<Role, string> = {
  farmer: 'from-green-600 to-green-700',
  admin: 'from-purple-600 to-purple-700',
}

export default function Navbar({ role, page, darkMode, onToggleDark, onMenuToggle, onNavigate, unreadNotifs = 0 }: NavbarProps) {
  const { user } = useAuth()
  const { t } = useTranslation()

  const rawName = user?.username || (user?.email ? user.email.split('@')[0] : 'Farmer')
  const displayName = formatDisplayName(rawName)
  const initials = getInitials(displayName)
  const profilePicUrl = getProfilePictureUrl(user?.profile_picture)

  return (
    <header className={`h-16 flex items-center justify-between px-4 lg:px-6 border-b ${darkMode ? 'bg-[#1E293B]/80 backdrop-blur-md border-gray-800' : 'bg-white/80 backdrop-blur-md border-border'} shadow-soft sticky top-0 z-30`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className={`lg:hidden p-2 rounded-lg ${darkMode ? 'text-text-muted hover:bg-gray-800' : 'text-text-muted hover:bg-background'}`}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className={`font-bold text-base leading-tight ${darkMode ? 'text-white' : 'text-text-primary'}`}>
            {t(page, pageTitles[page] || 'AgroAI')}
          </h1>
          <p className={`text-xs ${darkMode ? 'text-text-muted' : 'text-text-muted'}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Search */}
        <div className="hidden md:block">
          <SearchInput 
            value="" 
            onChange={() => {}} 
            placeholder={t('search', 'Search...')} 
            containerClassName="w-44 lg:w-52 py-1.5"
          />
        </div>

        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          aria-label="Toggle theme"
          title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          className={`p-2 rounded-xl transition-all-smooth cursor-pointer ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-background text-text-secondary hover:bg-background'}`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => onNavigate('notifications')}
          className={`relative p-2 rounded-xl transition-all-smooth ${darkMode ? 'bg-gray-800 text-text-muted hover:bg-gray-700' : 'bg-background text-text-secondary hover:bg-background'}`}
        >
          <Bell size={18} key={unreadNotifs > 0 ? 'has' : 'none'} className={unreadNotifs > 0 ? 'animate-bell-shake' : ''} />
          {unreadNotifs > 0 && (
            <span key={unreadNotifs} className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold leading-none animate-badge-pop">
              {unreadNotifs > 99 ? '99+' : unreadNotifs}
            </span>
          )}
        </button>

        {/* User */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all-smooth ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-background hover:bg-background'}`}
        >
          {profilePicUrl ? (
            <img src={profilePicUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-white text-xs font-bold`}>
              {initials}
            </div>
          )}
          <span className={`hidden md:block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-text-secondary'}`}>
            {displayName}
          </span>
          <ChevronDown size={14} className={darkMode ? 'text-text-muted' : 'text-text-muted'} />
        </button>
      </div>
    </header>
  )
}
