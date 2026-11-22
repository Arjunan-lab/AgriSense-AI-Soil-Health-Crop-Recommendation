import { useState, useCallback } from 'react';
import { sendChatMessage, sendImageChat, sendVoiceChat } from '../api/chatbot';
import { ChatMessage } from '../types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string, token?: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setLoading(true);
      setError(null);
      const reply = await sendChatMessage(text, token);
      const botMsg: ChatMessage = { sender: 'bot', text: reply || 'No response received.', timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to send message';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendImage = useCallback(async (file: File, token?: string) => {
    const userMsg: ChatMessage = { sender: 'user', text: '[Image Uploaded]', timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setLoading(true);
      setError(null);
      const reply = await sendImageChat(file, token);
      const botMsg: ChatMessage = { sender: 'bot', text: reply || 'Image analysis completed.', timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendVoice = useCallback(async (file: File, token?: string) => {
    const userMsg: ChatMessage = { sender: 'user', text: '[Voice Note]', timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setLoading(true);
      setError(null);
      const reply = await sendVoiceChat(file, token);
      const botMsg: ChatMessage = { sender: 'bot', text: reply || 'Voice note processed.', timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to process voice note');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    sendImage,
    sendVoice,
    clearMessages: () => setMessages([]),
  };
}

export default useChat;
