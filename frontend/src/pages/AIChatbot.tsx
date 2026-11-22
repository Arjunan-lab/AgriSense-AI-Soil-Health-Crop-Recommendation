import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { Bot, Send, Plus, ThumbsUp, ThumbsDown, Copy, Trash2, Check, Image, Mic, MessageSquare } from 'lucide-react'
import { Button } from '../components/ui'
import { FEATURES } from '../config'
import { chatAPI, ChatSessionSummary } from '../api/chat'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { extractResponseText, logChatPerformance } from '../utils/chatHelpers'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import { formatDisplayName } from '../utils/formatName'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const suggestedQuestions = [
  'What is the best crop for sandy loam soil with pH 6.5?',
  ...(FEATURES.DISEASE_DETECTION ? ['How do I treat leaf blight in rice plants?'] : ['How does soil pH affect wheat?']),
  'What is the optimal NPK ratio for wheat in Punjab?',
  'When is the best time to plant sugarcane in Maharashtra?',
  'How can I improve water retention in clay soil?',
]

function LanguageModal({
  onSelect,
  onClose,
}: {
  onSelect: (lang: string) => void
  onClose?: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-elevated p-8 max-w-sm w-full mx-4 border border-border">
        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Bot size={22} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-text-primary text-center mb-2">Choose Response Language</h3>
        <p className="text-sm text-text-muted text-center mb-6">Select your preferred response language for AgriSarthi AI</p>
        <div className="space-y-3">
          {['English', 'Hindi (हिंदी)', 'Punjabi (ਪੰਜਾਬੀ)', 'Telugu (తెలుగు)'].map((lStr) => {
            const langName = lStr.split(' ')[0]
            return (
              <button
                key={lStr}
                onClick={() => onSelect(langName)}
                className="w-full flex items-center gap-3 px-4 py-3 border-2 border-border rounded-xl hover:border-green-500 hover:bg-green-50/50 transition-all-smooth group text-left"
              >
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <p className="font-semibold text-text-primary group-hover:text-green-700">{lStr}</p>
                  <p className="text-xs text-text-muted">Multilingual response</p>
                </div>
              </button>
            )
          })}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-4 py-2 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors text-center"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `**Namaste! I'm AgriSarthi AI Assistant** 🌾

I'm your intelligent farming companion, powered by advanced AI. I can help you with:

- 🌱 **Crop recommendations** based on your soil and climate
${FEATURES.DISEASE_DETECTION ? '- 🔍 **Disease diagnosis** from plant descriptions\n' : ''}- 💧 **Irrigation & fertilizer advice**
- ☀️🌧️ **Weather-based farming decisions**
- 📈 **Yield optimization strategies**

How can I assist you with your farm today?`,
  time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
}

// Memoized Chat Bubble Component to eliminate unnecessary re-renders
const ChatBubble = memo(({
  msg,
  userInitials,
  feedback,
  copiedId,
  onFeedback,
  onCopy,
}: {
  msg: Message
  userInitials: string
  feedback?: 'up' | 'down'
  copiedId: string | null
  onFeedback: (id: string, dir: 'up' | 'down') => void
  onCopy: (id: string, content: string) => void
}) => {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-soft">
          <Bot size={15} className="text-white" />
        </div>
      )}
      <div className={`max-w-[82%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'gradient-primary text-white rounded-tr-sm shadow-soft'
              : 'bg-surface shadow-soft border border-border text-text-secondary rounded-tl-sm'
          }`}
        >
          <MarkdownRenderer content={msg.content} />
        </div>
        <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-text-muted">{msg.time}</span>
          {!isUser && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onFeedback(msg.id, 'up')}
                className={`p-1 rounded transition-colors ${
                  feedback === 'up' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'
                }`}
              >
                <ThumbsUp size={11} />
              </button>
              <button
                onClick={() => onFeedback(msg.id, 'down')}
                className={`p-1 rounded transition-colors ${
                  feedback === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <ThumbsDown size={11} />
              </button>
              <button
                onClick={() => onCopy(msg.id, msg.content)}
                className="p-1 rounded text-gray-400 hover:text-text-secondary transition-colors"
                title="Copy message"
              >
                {copiedId === msg.id ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
              </button>
            </div>
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-bold shadow-soft">
          {userInitials}
        </div>
      )}
    </div>
  )
})
ChatBubble.displayName = 'ChatBubble'

export default function AIChatbot() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const rawName = user?.username || (user?.email ? user.email.split('@')[0] : '')
  const formattedFullName = formatDisplayName(rawName)
  const firstName = formattedFullName ? formattedFullName.split(' ')[0] : 'Farmer'

  const userInitials = firstName.slice(0, 2).toUpperCase() || 'RF'

  const welcomeMessage: Message = {
    id: 'welcome',
    role: 'assistant',
    content: `**Hi ${firstName}! I'm AgriSarthi AI Assistant** 🌾

I'm your intelligent farming companion, powered by advanced AI. I can help you with:

- 🌱 **Crop recommendations** based on your soil and climate
${FEATURES.DISEASE_DETECTION ? '- 🔍 **Disease diagnosis** from plant descriptions\n' : ''}- 💧 **Irrigation & fertilizer advice**
- ☀️🌧️ **Weather-based farming decisions**
- 📈 **Yield optimization strategies**

How can I assist you with your farm today?`,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }

  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showLangModal, setShowLangModal] = useState(false)
  const [language, setLanguage] = useState<string>(
    () => localStorage.getItem('preferred_language') || 'English'
  )
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([])
  const [activeSessionId, setActiveSessionId] = useState<number | null>(() => {
    const saved = localStorage.getItem('active_chat_session_id')
    return saved ? Number(saved) : null
  })
  const [feedbacks, setFeedbacks] = useState<Record<string, 'up' | 'down'>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mountLoadedRef = useRef(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, isTyping, scrollToBottom])

  // Load chat session history list
  const loadHistory = useCallback(async () => {
    try {
      const historyData = await chatAPI.getHistory()
      if (historyData && Array.isArray(historyData.sessions)) {
        setSessions(historyData.sessions)
      }
    } catch (err) {
      console.warn('Failed to load chat history from backend:', err)
    }
  }, [])

  // Load full messages for a specific session ID (on manual click or mount)
  const loadSessionMessages = useCallback(async (sessionId: number) => {
    try {
      const sessionData = await chatAPI.getSession(sessionId)
      if (sessionData && Array.isArray(sessionData.messages)) {
        if (sessionData.messages.length === 0) {
          setMessages([DEFAULT_WELCOME_MESSAGE])
          return
        }
        const formattedMessages: Message[] = sessionData.messages.map(m => ({
          id: String(m.id),
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.translated_message || m.message,
          time: new Date(m.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }))
        setMessages(formattedMessages)
        setActiveSessionId(sessionId)
        localStorage.setItem('active_chat_session_id', String(sessionId))
      }
    } catch (err) {
      console.error('Failed to load chat session detail:', err)
    }
  }, [])

  // Initialize history ONLY ONCE on mount
  useEffect(() => {
    if (mountLoadedRef.current) return
    mountLoadedRef.current = true

    loadHistory().then(() => {
      const savedSessionId = localStorage.getItem('active_chat_session_id')
      if (savedSessionId && !isNaN(Number(savedSessionId))) {
        loadSessionMessages(Number(savedSessionId))
      }
    })
  }, [loadHistory, loadSessionMessages])

  const handleSend = async (text?: string) => {
    const tClick = performance.now()
    const msgText = (text || input).trim()
    if (!msgText || isTyping) return
    setInput('')

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msgText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    const tReqStart = performance.now()

    try {
      // Direct, zero-delay fast API call
      const res = await chatAPI.sendMessage({
        message: msgText,
        session_id: activeSessionId,
        response_language: language,
      })

      const tRespReceived = performance.now()

      if (res?.needs_language_selection) {
        setShowLangModal(true)
      }

      const answerText = extractResponseText(res)

      if (res?.session_id && res.session_id !== activeSessionId) {
        setActiveSessionId(res.session_id)
        localStorage.setItem('active_chat_session_id', String(res.session_id))
      }

      const aiMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answerText || 'Unable to format response.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages(prev => [...prev, aiMsg])

      // Print exact latency breakdown to console
      requestAnimationFrame(() => {
        const tRenderComplete = performance.now()
        logChatPerformance({
          clickTime: tClick,
          reqStartTime: tReqStart,
          respReceivedTime: tRespReceived,
          renderCompleteTime: tRenderComplete,
        })
      })
    } catch (err: any) {
      console.error('Error contacting AgriSarthi AI backend:', err)
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to connect to AgroAI services. Please try again.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleNewChat = () => {
    setActiveSessionId(null)
    localStorage.removeItem('active_chat_session_id')
    setMessages([DEFAULT_WELCOME_MESSAGE])
  }

  const handleLangSelect = async (selectedLang: string) => {
    setLanguage(selectedLang)
    localStorage.setItem('preferred_language', selectedLang)
    setShowLangModal(false)

    if (activeSessionId) {
      try {
        await chatAPI.setSessionLanguage(activeSessionId, selectedLang)
      } catch (err) {
        console.warn('Failed to set session response language:', err)
      }
    }
  }

  const handleCopy = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const handleFeedback = useCallback((id: string, dir: 'up' | 'down') => {
    setFeedbacks(f => ({ ...f, [id]: dir }))
  }, [])

  const handleDeleteHistory = async () => {
    if (window.confirm('Are you sure you want to delete your entire chat history?')) {
      try {
        await chatAPI.deleteHistory()
        setSessions([])
        handleNewChat()
      } catch (err) {
        console.error('Failed to delete chat history:', err)
      }
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] animate-fade-in">
      {showLangModal && (
        <LanguageModal
          onSelect={handleLangSelect}
          onClose={() => setShowLangModal(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-surface border-r border-border p-4 gap-4 flex-shrink-0">
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={handleNewChat}
          className="w-full justify-center shadow-soft"
        >
          New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Recent Conversations
              </h4>
              {sessions.length > 0 && (
                <button
                  onClick={handleDeleteHistory}
                  title="Clear all chat history"
                  className="text-text-muted hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <div className="space-y-1">
              {sessions.length === 0 ? (
                <p className="text-xs text-text-muted px-2 py-3 italic text-center">
                  No previous chats found
                </p>
              ) : (
                sessions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => loadSessionMessages(s.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all-smooth flex items-start gap-2.5 ${
                      activeSessionId === s.id
                        ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-medium border border-green-200/50'
                        : 'text-text-secondary hover:bg-background'
                    }`}
                  >
                    <MessageSquare size={16} className="mt-0.5 flex-shrink-0 opacity-70" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold">
                        {s.last_message ? s.last_message : `Session #${s.id}`}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {new Date(s.updated_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
              Suggested Questions
            </h4>
            <div className="space-y-1">
              {suggestedQuestions.slice(0, 4).map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-muted hover:bg-background hover:text-text-secondary transition-colors leading-relaxed border border-transparent hover:border-border"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-green-700 dark:text-green-400">
              Language: {language}
            </p>
            <p className="text-[10px] text-green-600 dark:text-green-500">AgriSarthi Multilingual AI</p>
          </div>
          <button
            onClick={() => setShowLangModal(true)}
            className="text-xs font-bold text-green-700 underline hover:text-green-800"
          >
            Change
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {/* Header */}
        <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-text-primary text-sm">AgriSarthi AI Assistant</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-text-muted">Online · Agricultural AI Specialist</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLangModal(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-secondary border border-border text-text-secondary hover:text-text-primary transition-colors"
            >
              🌐 {language}
            </button>
            <button
              className="lg:hidden p-2 text-text-muted hover:text-text-secondary rounded-lg hover:bg-background transition-colors"
              onClick={handleNewChat}
              title="New Chat"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map(msg => (
            <ChatBubble
              key={msg.id}
              msg={msg}
              userInitials={userInitials}
              feedback={feedbacks[msg.id]}
              copiedId={copiedId}
              onFeedback={handleFeedback}
              onCopy={handleCopy}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                <Bot size={15} className="text-white" />
              </div>
              <div className="bg-surface shadow-soft border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-text-muted italic">AgriSarthi is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Pills for initial screen */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {suggestedQuestions.slice(0, 4).map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="flex-shrink-0 px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-secondary hover:border-green-400 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all-smooth max-w-[220px] text-left shadow-xs"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-transparent px-4 py-4 pb-6 mt-auto">
          <div className="flex gap-2 items-end max-w-4xl mx-auto">
            <div className="flex-1 flex items-end gap-2 px-4 py-3 rounded-xl border border-border bg-surface transition-all duration-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 shadow-sm">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={t('ask_anything', 'Ask AgriSarthi about crops, soil health, fertilizers, or diseases...')}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder-text-muted resize-none max-h-28 leading-relaxed"
              />
              <div className="flex items-center gap-1 flex-shrink-0 pb-0.5">
                <button
                  type="button"
                  className="p-1.5 text-text-muted hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                  title="Upload Image"
                >
                  <Image size={16} />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-text-muted hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                  title="Voice Input"
                >
                  <Mic size={16} />
                </button>
              </div>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 rounded-xl bg-green-700 hover:bg-green-800 flex items-center justify-center text-white disabled:opacity-40 transition-all active:scale-[0.98] flex-shrink-0 shadow-sm"
              title="Send Message"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-2 text-center max-w-4xl mx-auto">
            AgriSarthi AI offers agricultural recommendations. Verify critical decisions with local agricultural experts.
          </p>
        </div>
      </div>
    </div>
  )
}
