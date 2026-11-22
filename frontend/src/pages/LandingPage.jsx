import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Brain,
  Cloud,
  Shield,
  Users,
  Sprout,
  Bug,
  FlaskConical,
  Bot,
  ChevronRight,
  Star,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../components/common/FigmaUI';
import FloatingChatbot from '../components/common/FloatingChatbot';

const stats = [
  { value: '50K+', label: 'Farmers Served' },
  { value: '98.2%', label: 'AI Accuracy' },
  { value: '12', label: 'Crop Types' },
  { value: '24/7', label: 'AI Support' },
];

const features = [
  { icon: <Leaf size={24} className="text-green-600" />, title: 'Soil Classification', desc: 'AI-powered soil analysis with confidence scoring and crop suitability mapping.' },
  { icon: <Sprout size={24} className="text-green-600" />, title: 'Crop Recommendation', desc: 'Get optimal crop suggestions based on NPK, temperature, humidity, pH and rainfall data.' },
  { icon: <FlaskConical size={24} className="text-blue-600" />, title: 'Fertilizer Advisor', desc: 'Personalized organic and chemical fertilizer recommendations with application timing.' },
  { icon: <Bot size={24} className="text-purple-600" />, title: 'Multilingual AI Chatbot', desc: 'Context-aware agriculture assistant available in 10+ regional languages.' },
  { icon: <Cloud size={24} className="text-blue-500" />, title: 'Weather Intelligence', desc: 'Hyperlocal 7-day forecasts with agricultural recommendations and alerts.' },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Wheat Farmer, Punjab', rating: 5, text: 'AgroAI doubled my yield in one season. The crop recommendation was spot on for my soil type.' },
  { name: 'Dr. Priya Sharma', role: 'Agricultural Researcher', rating: 5, text: 'The AI model accuracy and research analytics are impressive. Best tool in the market.' },
  { name: 'Mohammed Al-Farsi', role: 'Date Palm Farmer, UAE', rating: 5, text: 'The multilingual chatbot in Arabic made it incredibly easy to use. Revolutionary product.' },
];

const faqs = [
  { q: 'How accurate is the AI model?', a: 'Our models achieve 98.2% accuracy on crop recommendations and 96.7% on soil classification, trained on 2M+ samples.' },
  { q: 'Is my data secure?', a: 'Yes. We use JWT authentication, end-to-end encryption, and GDPR-compliant data handling.' },
  { q: 'Which languages are supported?', a: 'The chatbot supports English, Hindi, Arabic, Tamil, Telugu, Marathi, Punjabi, Bengali, Urdu, and Kannada.' },
  { q: 'Can researchers access raw data?', a: 'Researchers get full dataset access, model metrics (Precision, Recall, F1), confusion matrices, and export tools.' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">AgroAI</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-green-700 transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-green-700 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-green-700 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
            <Button variant="primary" onClick={() => navigate('/register')} icon={<ArrowRight size={14} />}>Get Started</Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-3 animate-fade-in">
            <Button variant="outlined" className="w-full justify-center" onClick={() => navigate('/login')}>Sign In</Button>
            <Button variant="primary" className="w-full justify-center" onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-mesh">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-green-100">
                <Zap size={14} />
                Powered by Advanced AI/ML
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Smart Farming<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #2E7D32, #1565C0)' }}>
                  Powered by AI
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                AI-driven crop recommendations, soil classification, and weather intelligence for modern agriculture. Join 50,000+ farmers transforming their yields.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Button size="lg" variant="primary" onClick={() => navigate('/register')} icon={<ArrowRight size={16} />}>Start Free Trial</Button>
                <Button size="lg" variant="outlined" onClick={() => navigate('/login')}>Sign In</Button>
              </div>

              <div className="flex flex-wrap gap-6">
                {['No credit card required', 'WCAG 2.1 AA accessible', '10+ languages'].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual Cards */}
            <div className="relative flex items-center justify-center">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                {[
                  { label: 'AI Accuracy', value: '98.2%', icon: <Brain size={20} className="text-green-600" />, bg: 'bg-green-50' },
                  { label: 'Crops Analyzed', value: '2.4M', icon: <Sprout size={20} className="text-blue-600" />, bg: 'bg-blue-50' },
                  { label: 'Soil Analyses', value: '15K', icon: <FlaskConical size={20} className="text-orange-600" />, bg: 'bg-orange-50' },
                  { label: 'Farmers Active', value: '50K+', icon: <Users size={20} className="text-purple-600" />, bg: 'bg-purple-50' },
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} rounded-2xl p-5 shadow-card border border-white animate-float`} style={{ animationDelay: `${i * 0.5}s` }}>
                    <div className="mb-2">{item.icon}</div>
                    <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #2E7D32, #1565C0)' }}>{s.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete AI Precision Farming Suite</h2>
            <p className="text-gray-600">Everything you need to optimize crop yields, diagnose soil conditions, and make data-driven agronomic decisions.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Farmers & Researchers</h2>
            <p className="text-gray-600">See how AgroAI is transforming agricultural productivity across regional farmlands.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 mb-3">{'★'.repeat(t.rating)}</div>
                  <p className="text-sm text-gray-700 italic mb-6">"{t.text}"</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about AgroAI platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left font-bold text-gray-900 text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronRight size={16} className={`transform transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-100 leading-relaxed">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-400" />
            <span className="font-black text-sm tracking-tight">AgroAI Platform</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 AgroAI Inc. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
};

export default LandingPage;
