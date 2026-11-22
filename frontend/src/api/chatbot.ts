/**
 * chatbot.ts
 * -----------
 * API client for AgriSarthi AI chatbot endpoints.
 * Centralized via apiClient instance.
 */

import apiClient from './client';

// --- Response Types ---

export interface LanguageTextPair {
  language: string;
  text: string;
}

export interface BilingualResponseDetail {
  preferred_language?: LanguageTextPair;
  english: LanguageTextPair;
}

export interface BilingualMessageDict {
  preferred_language?: string;
  english: string;
}

export interface ChatResponse {
  message?: string | BilingualMessageDict;
  response?: BilingualResponseDetail;
  needs_language_selection?: boolean;
  prompt?: string;
  session_id?: number | null;
  detected_language?: string;
  available_options?: string[];
}

export interface SetSessionLanguageResponse {
  session_id: number;
  response_language: string;
  message: string;
}

// --- Chat Endpoints ---

/**
 * Send a text message to AgriSarthi AI.
 */
export const sendChatMessageFull = async (
  text: string,
  token?: string
): Promise<ChatResponse> => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await apiClient.post('/chat', { message: text }, { headers });
  return response.data as ChatResponse;
};

/**
 * Send a text message and return ONLY the reply string.
 */
export const sendChatMessage = async (text: string, token?: string): Promise<string> => {
  const data = await sendChatMessageFull(text, token);
  if (data.response && 'preferred_language' in data.response && data.response.preferred_language) {
    return data.response.preferred_language.text;
  }
  if (data.response && 'english' in data.response && data.response.english) {
    return data.response.english.text;
  }
  if (typeof data.message === 'string') {
    return data.message;
  }
  return '';
};

/** Upload an image for plant disease analysis. */
export const sendImageChat = async (imageFile: File, token?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await apiClient.post('/chat/image', formData, { headers });
  const res = response.data?.response;
  if (res && res.preferred_language) {
    return res.preferred_language.text;
  }
  if (res && res.english) {
    return res.english.text;
  }
  return '';
};

/** Upload a voice message for STT -> Gemini -> TTS pipeline. */
export const sendVoiceChat = async (audioFile: File, token?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await apiClient.post('/chat/voice', formData, { headers });
  const res = response.data?.response;
  if (res && res.preferred_language) {
    return res.preferred_language.text;
  }
  if (res && res.english) {
    return res.english.text;
  }
  return '';
};

// --- Language Selection ---

export const setSessionLanguage = async (
  sessionId: number,
  language: string,
  token?: string
): Promise<SetSessionLanguageResponse> => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await apiClient.patch(
    `/chat/session/${sessionId}/language`,
    { response_language: language },
    { headers }
  );
  return response.data as SetSessionLanguageResponse;
};

// --- History ---

export const getChatHistory = async (token?: string) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await apiClient.get('/chat/history', { headers });
  return response.data;
};

export const getChatSession = async (sessionId: number, token?: string) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await apiClient.get(`/chat/session/${sessionId}`, { headers });
  return response.data;
};
