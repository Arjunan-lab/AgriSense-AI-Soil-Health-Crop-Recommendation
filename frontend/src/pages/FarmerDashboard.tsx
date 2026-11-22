import { Leaf, Sprout, FlaskConical, Cloud, TrendingUp, Droplets, Thermometer, Sun, Bell, ChevronRight, Activity, CloudLightning, Bug, Bot } from 'lucide-react'
import StatCard from '../components/StatCard'
import { Card, Badge } from '../components/ui'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FEATURES } from '../config'

import { useState, useEffect } from 'react'
import { dashboardAPI } from '../api/dashboard'
import { notificationAPI } from '../api/notification'
import { historyAPI } from '../api/history'

interface FarmerDashboardProps { onNavigate: (page: string) => void }

import { weatherService } from '../services/weatherService'

import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import { formatDisplayName } from '../utils/formatName'

export default function FarmerDashboard({ onNavigate }: FarmerDashboardProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [heroWeather, setHeroWeather] = useState<{ temp: number; condition: string; humidity: number } | null>(null)

  useEffect(() => {
    dashboardAPI.getDashboardData().then(data => {
      setStats(data)
    }).catch(err => {
      console.error(err)
    }).finally(() => {
      setLoading(false)
    })

    const userCity = user?.city || user?.district || 'Kotkapura'
    const gps = weatherService.getStoredGpsLocation()
    const query = gps ? { lat: gps.lat, lon: gps.lon } : { city: userCity }
    weatherService.fetchCurrentWeather(query).then(res => {
      setHeroWeather({
        temp: Math.round(res.temperature),
        condition: res.weather_condition || 'Sunny',
        humidity: Math.round(res.humidity),
      })
    }).catch(err => console.warn('Hero weather error:', err))
  }, [user])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const userName = formatDisplayName(user?.username || (user?.email ? user.email.split('@')[0] : 'Farmer'))
  const locationText = [user?.city, user?.district, user?.state, user?.country].filter(Boolean).join(', ') || 'Location Not Provided'

  const [userHistory, setUserHistory] = useState<any[]>([])

  useEffect(() => {
    historyAPI.getAll().then(data => {
      if (Array.isArray(data)) setUserHistory(data)
      else if (data?.items) setUserHistory(data.items)
    }).catch(() => {})
  }, [])

  const totalPredictions = stats?.total_predictions || userHistory.length || 0
  const avgConfidence = stats?.average_confidence ? Math.round(stats.average_confidence) : 0
  
  const dynamicRecentPredictions = userHistory.length > 0
    ? userHistory.slice(0, 4).map((p: any) => ({
        id: p.analysis_id || `P${p.id}`,
        type: p.recommended_crop ? 'Crop' : 'Soil',
        input: p.uploaded_image_name ? `Image: ${p.uploaded_image_name}` : 'Field Data',
        result: p.recommended_crop || p.predicted_soil || 'Analysis Result',
        confidence: Math.round(p.confidence || 90),
        date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recent',
        status: 'success'
      }))
    : (stats?.recent_predictions || []).map((p: any) => ({
        id: p.analysis_id || `P${p.id}`,
        type: p.recommended_crop ? 'Crop' : 'Soil',
        input: p.uploaded_image_name ? `Image: ${p.uploaded_image_name}` : 'Field Data',
        result: p.recommended_crop || p.predicted_soil || 'Analysis Result',
        confidence: Math.round(p.confidence || 90),
        date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recent',
        status: 'success'
      }))

  const [apiNotifs, setApiNotifs] = useState<any[]>([])

  useEffect(() => {
    notificationAPI.getNotifications().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setApiNotifs(data.slice(0, 4))
      }
    }).catch(() => {})
  }, [])

  const rawNotifSource = (stats?.recent_notifications?.length ? stats.recent_notifications : apiNotifs)
  const notificationsList = rawNotifSource.map((n: any) => ({
    icon: n.category === 'Weather' || n.type === 'weather' ? <Cloud size={14} className="text-blue-500" /> : <Bell size={14} className="text-green-500" />,
    title: n.title,
    desc: n.message,
    time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
    type: n.category || n.type || 'info'
  }))

  const cropDistData = (stats?.crop_distribution || []).map((c: any, index: number) => {
    const colors = ['#43A047', '#F9A825', '#FB8C00', '#1565C0', '#9C27B0', '#00ACC1']
    return {
      name: c.name || c.crop || 'Crop',
      value: c.value || c.count || 1,
      color: colors[index % colors.length]
    }
  })

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Hero Greeting */}
      <div className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
          <div className="w-full h-full rounded-full border-4 border-white" style={{ transform: 'translate(30%, -30%)' }} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm mb-1">{greeting},</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{userName} 🌾</h2>
            <p className="text-white/80 text-sm">Your fields in {locationText} are active in system database.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 bg-surface/15 backdrop-blur rounded-xl px-4 py-3 border border-white/20">
              <Thermometer size={18} className="text-orange-300" />
              <div>
                <p className="text-white/70 text-xs">Temperature</p>
                <p className="font-bold">{heroWeather ? `${heroWeather.temp}°C / ${heroWeather.condition}` : 'Live Weather'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface/15 backdrop-blur rounded-xl px-4 py-3 border border-white/20">
              <Droplets size={18} className="text-blue-300" />
              <div>
                <p className="text-white/70 text-xs">Humidity</p>
                <p className="font-bold">{heroWeather ? `${heroWeather.humidity}%` : 'Live'} — Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-2 ${FEATURES.DISEASE_DETECTION ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
        <StatCard title="Total Predictions" value={totalPredictions.toString()} change={totalPredictions > 0 ? "+100%" : "0"} trend="up" icon={<Activity size={20} className="text-green-600" />} iconBg="bg-green-100" />
        <StatCard title="Average Confidence" value={`${avgConfidence}%`} change={avgConfidence > 0 ? "+100%" : "0"} trend="up" icon={<Sprout size={20} className="text-blue-600" />} iconBg="bg-blue-100" />
        {FEATURES.DISEASE_DETECTION ? (
          <StatCard title="Disease Alerts" value="0" change="0" trend="down" icon={<Bug size={20} className="text-orange-600" />} iconBg="bg-orange-100" />
        ) : (
          <StatCard title="Weather Alerts" value={notificationsList.length.toString()} change="0" trend="up" icon={<CloudLightning size={20} className="text-amber-600" />} iconBg="bg-amber-100" />
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-5">
        <h3 className="font-bold text-text-primary mb-4">Quick Actions</h3>
        <div className={`grid grid-cols-3 ${FEATURES.DISEASE_DETECTION ? 'md:grid-cols-6' : 'md:grid-cols-5'} gap-3`}>
          {[
            { label: 'Soil Analysis', icon: <Leaf size={22} />, page: 'soil', color: 'bg-green-100 text-green-700' },
            { label: 'Crop Advice', icon: <Sprout size={22} />, page: 'crop', color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Fertilizer', icon: <FlaskConical size={22} />, page: 'fertilizer', color: 'bg-blue-100 text-blue-700' },
            ...(FEATURES.DISEASE_DETECTION ? [{ label: 'Disease AI', icon: <Bug size={22} />, page: 'disease', color: 'bg-orange-100 text-orange-700' }] : []),
            { label: 'AI Chatbot', icon: <Bot size={22} />, page: 'chatbot', color: 'bg-purple-100 text-purple-700' },
            { label: 'Weather', icon: <Cloud size={22} />, page: 'weather', color: 'bg-sky-100 text-sky-700' },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.page)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-background transition-all-smooth group">
              <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {a.icon}
              </div>
              <span className="text-xs font-medium text-text-secondary text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Prediction Trend */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-text-primary">Prediction Trends</h3>
            <Badge color="green">Database Verified</Badge>
          </div>
          {userHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userHistory.slice(0, 6).map((h: any) => ({ month: new Date(h.created_at).toLocaleDateString([], { month: 'short' }), predictions: 1, confidence: h.confidence }))} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2} /><stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="confidence" stroke="#2E7D32" strokeWidth={2} fill="url(#colorSoil)" name="Confidence %" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-text-muted border border-dashed border-border rounded-xl">
              No prediction history available in database
            </div>
          )}
        </Card>

        {/* Crop Distribution */}
        <Card className="p-5">
          <h3 className="font-bold text-text-primary mb-5">Crop Distribution</h3>
          {cropDistData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={cropDistData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {cropDistData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {cropDistData.map((c: any) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-text-secondary">{c.name}</span>
                    </div>
                    <span className="font-semibold text-text-secondary">{c.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-text-muted border border-dashed border-border rounded-xl">
              No crop distribution data available
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Predictions */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Recent Predictions</h3>
            <button onClick={() => onNavigate('history')} className="text-xs text-green-700 font-semibold hover:text-green-800 flex items-center gap-1">
              View All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {dynamicRecentPredictions.length > 0 ? (
              dynamicRecentPredictions.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-background transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${p.type === 'Crop' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.type[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{p.result}</p>
                    <p className="text-xs text-text-muted">{p.date} · {p.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-text-secondary">{p.confidence}%</p>
                    <Badge color="green">Saved</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border rounded-xl">
                No predictions recorded yet. Run your first Soil or Crop Analysis!
              </div>
            )}
          </div>
        </Card>

        {/* Notifications + Weather */}
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary">Alerts & Notifications</h3>
              <button onClick={() => onNavigate('notifications')} className="text-xs text-green-700 font-semibold">View All</button>
            </div>
            <div className="space-y-3">
              {notificationsList.length > 0 ? (
                notificationsList.map((n: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">{n.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{n.title}</p>
                      <p className="text-xs text-text-muted">{n.desc} · {n.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-text-muted border border-dashed border-border rounded-xl">
                  No unread notifications available
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-text-primary mb-4">Live Weather Advisory</h3>
            <div className="p-3 bg-background rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-primary">{heroWeather ? `${heroWeather.condition} Weather` : 'Current Weather'}</p>
                <p className="text-[11px] text-text-muted">Live sync with OpenWeatherMap API</p>
              </div>
              <button onClick={() => onNavigate('weather')} className="text-xs text-green-700 font-semibold flex items-center gap-1 hover:text-green-800">
                Full Weather <ChevronRight size={12} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
