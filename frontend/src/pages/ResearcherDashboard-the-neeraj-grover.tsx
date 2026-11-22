import { Download, BarChart3 } from 'lucide-react'
import { Card, Badge, Button, ProgressBar } from '../components/ui'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import FarmerDashboard from './FarmerDashboard'
import { FEATURES } from '../config'

const modelMetrics = [
  { metric: 'Precision', value: 97.4, subject: 'Precision' },
  { metric: 'Recall', value: 95.8, subject: 'Recall' },
  { metric: 'F1 Score', value: 96.6, subject: 'F1 Score' },
  { metric: 'Accuracy', value: 98.2, subject: 'Accuracy' },
  { metric: 'AUC-ROC', value: 99.1, subject: 'AUC-ROC' },
  { metric: 'Specificity', value: 94.3, subject: 'Specificity' },
]

const modelHistory = [
  { version: 'v1.0', accuracy: 89.2, precision: 87.1, recall: 88.4 },
  { version: 'v1.5', accuracy: 92.8, precision: 91.0, recall: 91.6 },
  { version: 'v2.0', accuracy: 95.1, precision: 94.3, recall: 93.8 },
  { version: 'v2.5', accuracy: 96.4, precision: 96.0, recall: 95.2 },
  { version: 'v3.0', accuracy: 98.2, precision: 97.4, recall: 95.8 },
]

const datasetStats = [
  { label: 'Training Samples', value: '1.85M', trend: '+12K this week' },
  { label: 'Validation Set', value: '185K', trend: 'MNIST-level quality' },
  { label: 'Test Accuracy', value: '98.2%', trend: 'State of the art' },
  { label: 'Model Version', value: 'v3.0', trend: 'Released Jul 15, 2026' },
]

interface ResearcherDashboardProps { onNavigate: (page: string) => void }

export default function ResearcherDashboard({ onNavigate }: ResearcherDashboardProps) {
  return (
    <div className="space-y-0">
      {/* Research-specific section */}
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Research Dashboard</h2>
            <p className="text-sm text-gray-500">AI model performance and dataset analytics — Dr. Priya Sharma</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" icon={<Download size={14} />}>Export Dataset</Button>
            <Button variant="primary" size="sm" icon={<BarChart3 size={14} />}>Download Report</Button>
          </div>
        </div>

        {/* Dataset Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {datasetStats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800 mb-1">{s.value}</p>
              <p className="text-[11px] text-green-700 font-medium">{s.trend}</p>
            </div>
          ))}
        </div>

        {/* Model Performance Charts */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Radar Chart */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Model Performance Radar</h3>
              <Badge color="green">v3.0 — Current</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={modelMetrics}>
                <PolarGrid gridType="polygon" stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <PolarRadiusAxis angle={30} domain={[85, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Model v3.0" dataKey="value" stroke="#2E7D32" fill="#2E7D32" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {modelMetrics.slice(0, 3).map(m => (
                <div key={m.metric} className="text-center">
                  <p className="text-lg font-bold text-gray-800">{m.value}%</p>
                  <p className="text-[10px] text-gray-400">{m.metric}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Version History */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Model Version History</h3>
              <Badge color="blue">Accuracy trend</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={modelHistory} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="version" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="accuracy" stroke="#2E7D32" strokeWidth={2.5} dot={{ r: 4 }} name="Accuracy" />
                <Line type="monotone" dataKey="precision" stroke="#1565C0" strokeWidth={2} dot={{ r: 3 }} name="Precision" />
                <Line type="monotone" dataKey="recall" stroke="#FB8C00" strokeWidth={2} dot={{ r: 3 }} name="Recall" />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-3 space-y-2">
              {modelMetrics.slice(3).map(m => (
                <ProgressBar key={m.metric} value={m.value} label={m.metric} color="#2E7D32" />
              ))}
            </div>
          </Card>
        </div>

        {/* Research Reports */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Research Reports</h3>
            <Button variant="outlined" size="sm" icon={<Download size={14} />}>Download All</Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Crop Yield Prediction Model v3.0', date: 'Jul 15, 2026', pages: 24, type: 'Model Report' },
              { title: 'Soil Classification CNN Analysis', date: 'Jun 28, 2026', pages: 18, type: 'Research Paper' },
              ...(FEATURES.DISEASE_DETECTION ? [{ title: 'Disease Detection Benchmark Study', date: 'Jun 10, 2026', pages: 32, type: 'Benchmark' }] : [{ title: 'Weather Forecast Benchmark Study', date: 'Jun 10, 2026', pages: 32, type: 'Benchmark' }]),
            ].map(r => (
              <div key={r.title} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <Badge color="blue">{r.type}</Badge>
                  <span className="text-[10px] text-gray-400">{r.pages}p</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1 leading-tight">{r.title}</p>
                <p className="text-xs text-gray-400">{r.date}</p>
                <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800">
                  <Download size={12} /> Download PDF
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Farmer Dashboard section below */}
      <div className="border-t border-gray-100">
        <div className="px-4 md:px-6 pt-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Field Management</h3>
        </div>
        <FarmerDashboard onNavigate={onNavigate} />
      </div>
    </div>
  )
}
