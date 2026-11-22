import React from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../components/common/FigmaUI';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import FarmerDashboard from './Dashboard';

const modelMetrics = [
  { metric: 'Precision', value: 97.4, subject: 'Precision' },
  { metric: 'Recall', value: 95.8, subject: 'Recall' },
  { metric: 'F1 Score', value: 96.6, subject: 'F1 Score' },
  { metric: 'Accuracy', value: 98.2, subject: 'Accuracy' },
  { metric: 'AUC-ROC', value: 99.1, subject: 'AUC-ROC' },
  { metric: 'Specificity', value: 94.3, subject: 'Specificity' },
];

const modelHistory = [
  { version: 'v1.0', accuracy: 89.2, precision: 87.1, recall: 88.4 },
  { version: 'v1.5', accuracy: 92.8, precision: 91.0, recall: 91.6 },
  { version: 'v2.0', accuracy: 95.1, precision: 94.3, recall: 93.8 },
  { version: 'v2.5', accuracy: 96.4, precision: 96.0, recall: 95.2 },
  { version: 'v3.0', accuracy: 98.2, precision: 97.4, recall: 95.8 },
];

const datasetStats = [
  { label: 'Training Samples', value: '1.85M', trend: '+12K this week' },
  { label: 'Validation Set', value: '185K', trend: 'MNIST-level quality' },
  { label: 'Test Accuracy', value: '98.2%', trend: 'State of the art' },
  { label: 'Model Version', value: 'v3.0', trend: 'Released Jul 15, 2026' },
];

export default function ResearcherDashboard() {
  return (
    <div className="space-y-0 pb-12">
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Research Dashboard</h2>
            <p className="text-xs text-slate-500 font-semibold">AI model performance and dataset analytics — Dr. Priya Sharma</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" icon={<Download size={14} />}>Export Dataset</Button>
            <Button variant="primary" size="sm" icon={<BarChart3 size={14} />}>Download Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {datasetStats.map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 font-bold mb-1">{s.label}</p>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">{s.value}</p>
              <p className="text-[11px] text-emerald-600 font-bold">{s.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Model Performance Radar</h3>
              <Badge color="green">v3.0 — Current</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={modelMetrics}>
                <PolarGrid gridType="polygon" stroke="#94a3b8" strokeOpacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <PolarRadiusAxis angle={30} domain={[85, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Model v3.0" dataKey="value" stroke="#2E7D32" fill="#2E7D32" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Model Version History</h3>
              <Badge color="blue">Accuracy trend</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={modelHistory} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="version" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="accuracy" stroke="#2E7D32" strokeWidth={2.5} dot={{ r: 4 }} name="Accuracy" />
                <Line type="monotone" dataKey="precision" stroke="#1565C0" strokeWidth={2} dot={{ r: 3 }} name="Precision" />
                <Line type="monotone" dataKey="recall" stroke="#FB8C00" strokeWidth={2} dot={{ r: 3 }} name="Recall" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <FarmerDashboard />
      </div>
    </div>
  );
}
