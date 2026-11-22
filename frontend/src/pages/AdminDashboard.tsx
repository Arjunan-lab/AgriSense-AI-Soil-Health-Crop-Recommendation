import { useState, useEffect } from 'react'
import { Users, Activity, BarChart3 } from 'lucide-react'
import StatCard from '../components/StatCard'
import { Card, Badge, StatusDot } from '../components/ui'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { adminAPI, AdminDashboardResponse } from '../api/admin'
import { useTranslation } from '../hooks/useTranslation'
import DashboardSkeleton from '../components/Dashboard/DashboardSkeleton'

export interface AdminDashboardProps {
  onNavigate?: (page: string) => void
}

const COLORS = ['#2E7D32', '#1565C0', '#FB8C00', '#7B1FA2', '#D32F2F', '#0288D1']

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { t } = useTranslation()
  const [stats, setStats] = useState<AdminDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchStats = async () => {
      try {
        const data = await adminAPI.getDashboardStats()
        if (isMounted) {
          setStats(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch admin dashboard stats:', err)
        if (isMounted) setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  if (loading && !stats) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <DashboardSkeleton />
      </div>
    )
  }

  // Data Mappings from Backend APIs
  const userGrowth = (stats?.charts?.user_growth_area && stats.charts.user_growth_area.length > 0)
    ? stats.charts.user_growth_area.map((dp: any) => ({
        month: dp.label,
        farmers: dp.value,
        total: dp.value
      }))
    : (stats?.prediction_analytics?.monthly_trend && stats.prediction_analytics.monthly_trend.length > 0)
      ? stats.prediction_analytics.monthly_trend.map((m: any) => ({
          month: m.date,
          farmers: m.count,
          total: m.count
        }))
      : []

  const cropData = (stats?.crop_analytics?.top_10_crops && stats.crop_analytics.top_10_crops.length > 0)
    ? stats.crop_analytics.top_10_crops.slice(0, 5).map((c: any) => ({
        name: c.crop || c.label,
        value: c.count !== undefined ? c.count : c.value
      }))
    : (stats?.charts?.crop_recommendations_bar && stats.charts.crop_recommendations_bar.length > 0)
      ? stats.charts.crop_recommendations_bar.slice(0, 5).map((dp: any) => ({
          name: dp.label,
          value: dp.value
        }))
      : []

  const soilData = (stats?.soil_analytics?.distribution && stats.soil_analytics.distribution.length > 0)
    ? stats.soil_analytics.distribution.map((s: any) => ({
        name: (s.soil_type || s.label || '').replace(/ Soil$/i, ''),
        value: s.count !== undefined ? s.count : s.value
      }))
    : (stats?.charts?.soil_distribution_pie && stats.charts.soil_distribution_pie.length > 0)
      ? stats.charts.soil_distribution_pie.map((dp: any) => ({
          name: (dp.label || '').replace(/ Soil$/i, ''),
          value: dp.value
        }))
      : []

  const nutrientData = (stats?.fertilizer_analytics?.fertilizer_counts && stats.fertilizer_analytics.fertilizer_counts.length > 0)
    ? stats.fertilizer_analytics.fertilizer_counts.slice(0, 5).map((f: any) => ({
        name: f.fertilizer || f.name,
        value: f.count || f.value
      }))
    : []

  const totalUsersValue = stats?.overview?.total_users != null ? stats.overview.total_users.toLocaleString() : "0"
  const activeUsersTodayValue = stats?.overview?.active_users_today != null ? stats.overview.active_users_today.toLocaleString() : "0"
  const totalPredictionsValue = stats?.overview?.total_predictions != null ? stats.overview.total_predictions.toLocaleString() : "0"

  const userGrowthChange = stats?.overview?.new_registrations_this_month != null ? `+${stats.overview.new_registrations_this_month} this mo.` : "+0%"
  const activeTodayChange = stats?.overview?.active_users_this_week != null ? `+${stats.overview.active_users_this_week} this wk.` : "+0%"
  const totalPredictionsChange = stats?.prediction_analytics?.growth_percentage != null ? `+${stats.prediction_analytics.growth_percentage}%` : "+0%"

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{t('admin_dashboard', 'Enterprise Dashboard')}</h2>
          <p className="text-sm text-text-muted">{t('system_health_overview', 'Platform overview and system health — Real-Time Live Data')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 dark:bg-green-950/20 dark:border-green-900/30">
            <StatusDot status="green" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">{t('all_systems_operational', 'All Systems Operational')}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title={t('total_users', 'Total Users')} value={totalUsersValue} change={userGrowthChange} trend="up" icon={<Users size={20} className="text-white" />} gradient color="linear-gradient(135deg, #2E7D32, #43A047)" />
        <StatCard title={t('active_today', 'Active Today')} value={activeUsersTodayValue} change={activeTodayChange} trend="up" icon={<Activity size={20} className="text-white" />} gradient color="linear-gradient(135deg, #1565C0, #1976D2)" />
        <StatCard title={t('total_predictions', 'Total Predictions')} value={totalPredictionsValue} change={totalPredictionsChange} trend="up" icon={<BarChart3 size={20} className="text-white" />} gradient color="linear-gradient(135deg, #7B1FA2, #9C27B0)" />
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* User Growth */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-text-primary">{t('user_growth', 'User Growth')}</h3>
            <Badge color="blue">2026 Live</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowth} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.25} /><stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Area type="monotone" dataKey="farmers" stroke="#2E7D32" strokeWidth={2} fill="url(#colorFarmers)" name="Farmers" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Most Recommended Crops */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-text-primary">{t('most_recommended_crops', 'Most Recommended Crops')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cropData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" fill="#4CAF50" radius={[4, 4, 0, 0]} name="Recommendations" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Soil Type Distribution */}
        <Card className="p-5">
          <h3 className="font-bold text-text-primary mb-5">{t('soil_type_distribution', 'Soil Type Distribution')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={soilData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {soilData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Nutrient Deficiencies */}
        <Card className="p-5">
          <h3 className="font-bold text-text-primary mb-5">{t('nutrient_deficiency_incidents', 'Nutrient Deficiency Incidents')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={nutrientData} layout="vertical" margin={{ top: 5, right: 5, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" fill="#FB8C00" radius={[0, 4, 4, 0]} name="Incidents (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
