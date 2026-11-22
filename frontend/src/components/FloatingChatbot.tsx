import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { Bot, X, Send, Mic, Image as ImageIcon, Sparkles, Trash2, Copy, Check } from 'lucide-react'
import { chatAPI } from '../api/chat'
import { MarkdownRenderer } from './MarkdownRenderer'
import { extractResponseText, logChatPerformance } from '../utils/chatHelpers'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const ChatBubble = memo(({
  msg,
  copiedId,
  onCopy,
}: {
  msg: Message
  copiedId: string | null
  onCopy: (id: string, content: string) => void
}) => {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-xs">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[82%] sm:max-w-[80%] rounded-2xl px-4 py-2.5 text-sm relative group ${isUser ? 'gradient-primary text-white rounded-tr-sm shadow-soft' : 'bg-surface border border-border text-text-primary rounded-tl-sm shadow-sm'}`}>
        <MarkdownRenderer content={msg.content} />

        {/* Copy Button */}
        {!isUser && (
          <button
            onClick={() => onCopy(msg.id, msg.content)}
            className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-border rounded-lg shadow-soft"
            title="Copy text"
          >
            {copiedId === msg.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  )
})
ChatBubble.displayName = 'ChatBubble'

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Namaste! I am your AgriSarthi AI Assistant. How can I help you today with your farming needs?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<number | null>(() => {
    const saved = localStorage.getItem('active_chat_session_id')
    return saved ? Number(saved) : null
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, isTyping, isOpen, scrollToBottom])

  const handleSend = async (text: string) => {
    const tClick = performance.now()
    const msgText = text.trim()
    if (!msgText || isTyping) return

    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', content: msgText }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const tReqStart = performance.now()

    try {
      const preferredLang = localStorage.getItem('preferred_language') || 'English'
      const response = await chatAPI.sendMessage({
        message: msgText,
        session_id: sessionId,
        response_language: preferredLang,
      })

      const tRespReceived = performance.now()

      if (response?.session_id && response.session_id !== sessionId) {
        setSessionId(response.session_id)
        localStorage.setItem('active_chat_session_id', String(response.session_id))
      }

      const answerText = extractResponseText(response)

      const aiMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answerText || 'Unable to format backend response.',
      }
      setMessages(prev => [...prev, aiMsg])

      requestAnimationFrame(() => {
        const tRenderComplete = performance.now()
        logChatPerformance({
          clickTime: tClick,
          reqStartTime: tReqStart,
          respReceivedTime: tRespReceived,
          renderCompleteTime: tRenderComplete,
        })
      })
    } catch (err) {
      console.error('FloatingChatbot error:', err)
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Unable to connect to AgroAI services. Please try again.`,
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleCopy = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const handleClear = () => {
    setSessionId(null)
    localStorage.removeItem('active_chat_session_id')
    setMessages([{ id: Date.now().toString(), role: 'assistant', content: 'Conversation cleared. How can I assist you now? 🌱' }])
  }

  const SUGGESTIONS = [
    "What crop is best for sandy soil?",
    "How to treat yellowing leaves?",
    "Optimal fertilizer ratio for wheat?"
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 max-h-[600px] h-[80vh] bg-surface rounded-2xl shadow-elevated border border-border flex flex-col overflow-hidden animate-fade-in origin-bottom-right" style={{ backdropFilter: 'blur(10px)' }}>
          {/* Header */}
          <div className="p-4 gradient-primary text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-sm">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-green-600 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm">AgriSarthi Assistant</h3>
                <p className="text-xs text-white/80 font-medium">Online • Multilingual AI</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleClear} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Clear Chat">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                msg={msg}
                copiedId={copiedId}
                onCopy={handleCopy}
              />
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mr-2">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-xs text-text-muted italic ml-1">AgriSarthi is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length < 3 && !isTyping && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto custom-scrollbar border-t border-border bg-background">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} className="flex-shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-surface border-t border-border">
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all shadow-sm">
              <button className="text-text-muted hover:text-green-600 transition-colors" title="Upload Image">
                <ImageIcon size={18} />
              </button>
              <input
                type="text"
                placeholder="Ask AgriSarthi anything..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary px-2"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              />
              {input.trim() ? (
                <button onClick={() => handleSend(input)} className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-soft">
                  <Send size={14} />
                </button>
              ) : (
                <button className="text-text-muted hover:text-green-600 transition-colors" title="Voice Input">
                  <Mic size={18} />
                </button>
              )}
            </div>
            <div className="text-center mt-2 flex items-center justify-center gap-1">
              <Sparkles size={10} className="text-green-600" />
              <span className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">Powered by AgriSarthi AI</span>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full gradient-primary text-white shadow-elevated flex items-center justify-center hover:scale-105 transition-transform relative group"
        title="AgriSarthi Assistant"
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </button>
    </div>
  )
}
