/**
 * ChatLanguagePopup.tsx
 * ----------------------
 * One-time language selection popup for the AgriSarthi AI chatbot.
 *
 * Shown ONLY when:
 *   1. The user sends their FIRST message in a new chat session.
 *   2. The message is detected as English.
 *   3. The user has a non-English preferred language.
 *
 * The popup allows the user to choose:
 *   - English   → all responses in this session stay English
 *   - Preferred Language (e.g. Punjabi) → all responses translated to preferred language
 *
 * The choice is saved per-session via PATCH /chat/session/{id}/language.
 * Starting a new chat resets this choice.
 *
 * Usage:
 *   <ChatLanguagePopup
 *     isOpen={showPopup}
 *     sessionId={sessionId}
 *     preferredLanguage="Punjabi"
 *     pendingMessage="How to grow rice?"
 *     onLanguageSelected={(lang) => resendMessage(lang)}
 *     onClose={() => setShowPopup(false)}
 *   />
 */

import React, { useState, useEffect, useCallback } from 'react';
import { setSessionLanguage } from '../../api/chatbot';
import { useAuth } from '../../context/AuthContext';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatLanguagePopupProps {
  /** Whether the popup is visible. */
  isOpen: boolean;
  /** The chat session ID returned by the backend. */
  sessionId: number;
  /** The user's preferred language (e.g. "Punjabi", "Hindi", "Telugu"). */
  preferredLanguage: string;
  /** The pending message that triggered this popup (displayed as a preview). */
  pendingMessage: string;
  /**
   * Called after the user selects a language and the backend has been updated.
   * Receives the chosen language string so the parent can re-send the message.
   */
  onLanguageSelected: (language: string) => void;
  /** Called when the popup is dismissed without a choice (e.g. backdrop click). */
  onClose?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ChatLanguagePopup: React.FC<ChatLanguagePopupProps> = ({
  isOpen,
  sessionId,
  preferredLanguage,
  pendingMessage,
  onLanguageSelected,
  onClose,
}) => {
  const { token } = useAuth() as { token: string | null };
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<'English' | string | null>(null);

  // Reset state when popup re-opens (new session)
  useEffect(() => {
    if (isOpen) {
      setSaving(false);
      setError(null);
      setSelected(null);
    }
  }, [isOpen, sessionId]);

  // Keyboard accessibility: close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleSelect = async (language: string) => {
    if (saving) return;
    setSelected(language);
    setSaving(true);
    setError(null);
    try {
      await setSessionLanguage(sessionId, language, token ?? '');
      onLanguageSelected(language);
    } catch {
      setError('Failed to save language preference. Please try again.');
      setSelected(null);
    } finally {
      setSaving(false);
    }
  };

  const messagePreview =
    pendingMessage.length > 80
      ? pendingMessage.slice(0, 80).trimEnd() + '…'
      : pendingMessage;

  return (
    <>
      {/* Backdrop */}
      <div
        id="chat-language-popup-backdrop"
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div
        id="chat-language-popup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-lang-title"
        aria-describedby="chat-lang-desc"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001,
          width: 'min(420px, 92vw)',
          background: 'linear-gradient(145deg, rgba(18,18,35,0.98) 0%, rgba(28,28,55,0.98) 100%)',
          border: '1px solid rgba(120,120,220,0.25)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
          padding: '32px',
          animation: 'popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        }}
      >
        {/* Header icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            marginBottom: '20px',
            boxShadow: '0 8px 20px rgba(99,102,241,0.4)',
          }}
        >
          <span style={{ fontSize: '26px' }}>🌐</span>
        </div>

        {/* Title */}
        <h2
          id="chat-lang-title"
          style={{
            margin: '0 0 8px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#f1f5f9',
            letterSpacing: '-0.3px',
          }}
        >
          Choose Chat Language
        </h2>

        {/* Description */}
        <p
          id="chat-lang-desc"
          style={{
            margin: '0 0 16px',
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: '1.6',
          }}
        >
          You asked your question in{' '}
          <strong style={{ color: '#c4b5fd' }}>English</strong>. Would you like{' '}
          <strong style={{ color: '#6366f1' }}>AgriSarthi AI</strong> to reply in
          English or your preferred language?
        </p>

        {/* Message preview */}
        {pendingMessage && (
          <div
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '24px',
              fontSize: '13px',
              color: '#cbd5e1',
              fontStyle: 'italic',
            }}
          >
            ❝ {messagePreview}
          </div>
        )}

        {/* Language Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {/* English button */}
          <button
            id="chat-lang-btn-english"
            onClick={() => handleSelect('English')}
            disabled={saving}
            aria-pressed={selected === 'English'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: '12px',
              border: selected === 'English'
                ? '2px solid #6366f1'
                : '1px solid rgba(255,255,255,0.1)',
              background: selected === 'English'
                ? 'rgba(99,102,241,0.18)'
                : 'rgba(255,255,255,0.04)',
              color: '#f1f5f9',
              fontSize: '15px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              textAlign: 'left',
              opacity: saving && selected !== 'English' ? 0.5 : 1,
              transform: selected === 'English' ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: '22px' }}>🇬🇧</span>
            <div>
              <div>English</div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>
                Respond in English
              </div>
            </div>
            {selected === 'English' && saving && (
              <span style={{ marginLeft: 'auto', fontSize: '16px', animation: 'spin 1s linear infinite' }}>⟳</span>
            )}
            {selected === 'English' && !saving && (
              <span style={{ marginLeft: 'auto', color: '#6366f1', fontSize: '18px' }}>✓</span>
            )}
          </button>

          {/* Preferred Language button */}
          <button
            id="chat-lang-btn-preferred"
            onClick={() => handleSelect(preferredLanguage)}
            disabled={saving}
            aria-pressed={selected === preferredLanguage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: '12px',
              border: selected === preferredLanguage
                ? '2px solid #8b5cf6'
                : '1px solid rgba(255,255,255,0.1)',
              background: selected === preferredLanguage
                ? 'rgba(139,92,246,0.18)'
                : 'rgba(255,255,255,0.04)',
              color: '#f1f5f9',
              fontSize: '15px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              textAlign: 'left',
              opacity: saving && selected !== preferredLanguage ? 0.5 : 1,
              transform: selected === preferredLanguage ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: '22px' }}>🌿</span>
            <div>
              <div>{preferredLanguage}</div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>
                Your preferred language
              </div>
            </div>
            {selected === preferredLanguage && saving && (
              <span style={{ marginLeft: 'auto', fontSize: '16px', animation: 'spin 1s linear infinite' }}>⟳</span>
            )}
            {selected === preferredLanguage && !saving && (
              <span style={{ marginLeft: 'auto', color: '#8b5cf6', fontSize: '18px' }}>✓</span>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#f87171', textAlign: 'center' }}>
            ⚠ {error}
          </p>
        )}

        {/* Footer note */}
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: '#475569',
            textAlign: 'center',
            lineHeight: '1.5',
          }}
        >
          🔒 This choice applies only to this chat session.
          <br />
          Starting a new chat will ask again.
        </p>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -54%) scale(0.92); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        #chat-lang-btn-english:hover:not(:disabled) {
          border-color: rgba(99,102,241,0.5) !important;
          background: rgba(99,102,241,0.12) !important;
        }
        #chat-lang-btn-preferred:hover:not(:disabled) {
          border-color: rgba(139,92,246,0.5) !important;
          background: rgba(139,92,246,0.12) !important;
        }
      `}</style>
    </>
  );
};

export default ChatLanguagePopup;
