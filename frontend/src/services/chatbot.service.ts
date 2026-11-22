/**
 * Chatbot Service
 * AgriSarthi AI chatbot text, image, and voice interaction service.
 */

import {
  sendChatMessage,
  sendChatMessageFull,
  sendImageChat,
  sendVoiceChat,
  setSessionLanguage,
  getChatHistory,
  getChatSession,
} from '../api/chatbot';

export const ChatbotService = {
  async sendMessage(text: string, token?: string) {
    return sendChatMessage(text, token);
  },

  async sendMessageFull(text: string, token?: string) {
    return sendChatMessageFull(text, token);
  },

  async sendImage(file: File, token?: string) {
    return sendImageChat(file, token);
  },

  async sendVoice(file: File, token?: string) {
    return sendVoiceChat(file, token);
  },

  async updateLanguage(sessionId: number, language: string, token?: string) {
    return setSessionLanguage(sessionId, language, token);
  },

  async getHistory(token?: string) {
    return getChatHistory(token);
  },

  async getSession(sessionId: number, token?: string) {
    return getChatSession(sessionId, token);
  },
};

export default ChatbotService;
