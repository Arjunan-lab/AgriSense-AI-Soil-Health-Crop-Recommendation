import React, { useState } from 'react';
import { Star, Send, Camera, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/common/FeedbackStates';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export const FeedbackPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('Crop Recommendation');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error(t('Please write a brief comment before submitting.'));
      return;
    }

    const newFeedback = {
      id: `FB-${Math.floor(100 + Math.random() * 900)}`,
      user: user?.username || 'Ramesh Singh',
      userId: user?.email ? user.email.slice(0, 7) : 'USR-101',
      category,
      rating,
      comment,
      status: 'New',
      date: new Date().toLocaleString(),
    };

    try {
      const saved = localStorage.getItem('agroai_feedback_list');
      const existing = saved ? JSON.parse(saved) : [];
      const updated = [newFeedback, ...existing];
      localStorage.setItem('agroai_feedback_list', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Feedback save error:', err);
    }

    setSubmitted(true);
    toast.success(t('Thank you! Your feedback has been submitted to AgroAI admin.'));
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      <PageHeader
        title={t('Submit User Feedback')}
        subtitle={t('Your feedback directly helps improve our AI crop models and soil diagnostic features.')}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                {t('How was your AI prediction experience?')}
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-2 text-2xl transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                {t('Category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Crop Recommendation">Crop Recommendation</option>
                <option value="Soil Diagnostics">Soil Diagnostics</option>
                <option value="Weather Forecast">Weather Forecast</option>
                <option value="AI Assistant Chatbot">AI Assistant Chatbot</option>
                <option value="User Interface & Performance">User Interface & Performance</option>
              </select>
            </div>

            {/* Comments Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                {t('Your Comments')}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('Tell us what you loved or what we can improve...')}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{t('Submit Feedback')}</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              {t('Feedback Submitted!')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {t('Your feedback has been logged into the Admin Live Feedback Center.')}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setComment('');
              }}
              className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl"
            >
              {t('Submit Another Response')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
