import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Minus, Send, Bot, User, Sparkles, RefreshCw, ChevronRight, Mic } from 'lucide-react';
import { sendChatMessage } from '../../api/chatbot';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  'Best fertilizer NPK ratio for Wheat?',
  'How to lower soil pH naturally?',
  'Water requirements for Paddy Rice?',
  'What crops grow best in Black Clay soil?',
];

export const FloatingChatbot: React.FC = () => {
  const { token } = useAuth() as { token: string | null };
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('agroai_chat_history');
      return saved ? JSON.parse(saved) : [
        {
          id: 'welcome-1',
          sender: 'bot',
          text: 'Hello! I am AgriSarthi AI, your enterprise agronomy assistant. Ask me anything about soil nutrients, crop diseases, or farming best practices!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('agroai_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleSend = async (textToSend?: string) => {
    const tClick = performance.now();
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const tReqStart = performance.now();

    try {
      const replyText = await sendChatMessage(query, token || '');
      const tRespReceived = performance.now();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText || 'I have analyzed your query. Ensure NPK balance is maintained for optimal yield.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setUnreadCount((c) => c + 1);

      requestAnimationFrame(() => {
        const tRenderComplete = performance.now();
        console.log(
          `%c[AgriSarthi Chatbot Performance Metrics]\n` +
          `UI Click: 0.00ms\n` +
          `API Request Started: +${Math.max(0, tReqStart - tClick).toFixed(2)}ms\n` +
          `Backend Response Received: +${Math.max(0, tRespReceived - tClick).toFixed(2)}ms\n` +
          `Frontend Render Completed: +${Math.max(0, tRenderComplete - tClick).toFixed(2)}ms\n` +
          `Total Time: ${Math.max(0, tRenderComplete - tClick).toFixed(2)}ms`,
          'color: #10B981; font-weight: bold; font-size: 12px;'
        );
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I encountered a temporary connection issue. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full shadow-2xl shadow-emerald-500/40 flex items-center justify-center cursor-pointer ring-4 ring-emerald-500/20"
          >
            <Bot className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHATBOT POPUP PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[560px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header Bar */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wide flex items-center gap-1.5">
                    AgriSarthi AI Assistant
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-emerald-100/80">Online • English Mode</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-1.5 rounded-xl shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-emerald-500'
                    }`}>
                      {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/10 rounded-tr-none'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-emerald-100/70 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Bot className="h-4 w-4 text-emerald-500 animate-pulse" />
                  <span className="font-medium animate-pulse">AgriSarthi is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Chips */}
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 text-slate-600 dark:text-slate-300 hover:text-emerald-600 text-[10px] font-semibold rounded-full whitespace-nowrap transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* SINGLE CLEAN INPUT - WITH VOICE SUPPORT PLACEHOLDER */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center w-full"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AgriSarthi AI (voice or text)..."
                  disabled={loading}
                  className="w-full pl-4 pr-20 py-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />

                <div className="absolute right-2 flex items-center space-x-1">
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
