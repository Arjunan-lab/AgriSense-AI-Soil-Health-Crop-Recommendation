/**
 * pages/AboutPage.jsx
 * -------------------
 * Static about / project information page.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Brain, Leaf, BarChart2, FileText, ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/common/FeedbackStates';
import { Card, CardContent } from '../components/common/Card';

const TECH_STACK = [
  { label: 'EfficientNetB2',   description: 'Soil image classification', color: 'text-primary-500' },
  { label: 'CatBoost',         description: 'Crop recommendation & analysis', color: 'text-secondary-500' },
  { label: 'FastAPI',          description: 'High-performance Python backend', color: 'text-accent-500' },
  { label: 'React 19',         description: 'Modern frontend framework', color: 'text-blue-500' },
  { label: 'PostgreSQL',       description: 'Relational data persistence', color: 'text-indigo-500' },
  { label: 'JWT Auth',         description: 'Secure stateless authentication', color: 'text-amber-500' },
];

const FEATURES = [
  { icon: Sprout,    title: 'Soil Classification',     desc: 'Instant soil type identification from a photo using EfficientNetB2.' },
  { icon: Brain,     title: 'Crop Recommendation',     desc: 'CatBoost ML models recommend optimal crops based on soil parameters.' },
  { icon: Leaf,      title: 'Soil Health Scoring',     desc: 'Composite health scores, fertility ratings, and nutrient deficiency detection.' },
  { icon: BarChart2, title: 'Analytics Dashboard',     desc: 'Historical analysis trends and agronomic insights at a glance.' },
  { icon: FileText,  title: 'PDF Report Generation',   desc: 'Download professional soil health reports for each analysis.' },
];

const AboutPage = () => {
  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        title="About Scatter AI"
        subtitle="AI-powered precision agriculture for smarter soil management."
      />

      {/* Hero description */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50/40 dark:from-primary-950/20 dark:to-secondary-950/10 border-primary-100 dark:border-primary-900/30">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-500 text-white rounded-card shrink-0">
              <Sprout className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-50">
                What is Scatter AI?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Scatter AI is a full-stack agricultural intelligence platform that combines
                computer vision and machine learning to provide instant, data-driven crop
                recommendations. Simply upload a soil image and receive a complete agronomic
                profile in seconds — no manual lab testing required.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Core features */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Core Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
            >
              <Card className="p-5">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-lg shrink-0">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{feature.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Technology Stack</h3>
        <Card className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TECH_STACK.map(({ label, description, color }) => (
              <div key={label} className="space-y-0.5">
                <p className={`text-sm font-bold ${color}`}>{label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <p className="text-xs text-center text-slate-400 dark:text-slate-600 pb-4">
        © {new Date().getFullYear()} Scatter AI — Agricultural Intelligence Platform v2.0
      </p>
    </div>
  );
};

export default AboutPage;
