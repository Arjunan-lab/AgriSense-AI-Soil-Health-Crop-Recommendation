import { apiClient } from './client';
import { getSmartAgriculturalResponse } from '../utils/agriculturalResponses';

export interface SendMessagePayload {
  message: string;
  session_id?: number | null;
  response_language?: string;
  language?: string; // fallback alias
}

export interface ChatSessionSummary {
  id: number;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message?: string | null;
}

export interface ChatHistoryResponse {
  total_sessions: number;
  sessions: ChatSessionSummary[];
}

export interface ChatMessageDetail {
  id: number;
  sender: 'user' | 'assistant' | string;
  message: string;
  translated_message?: string | null;
  image_path?: string | null;
  audio_path?: string | null;
  created_at: string;
}

export interface ChatSessionDetailResponse {
  session_id: number;
  created_at: string;
  updated_at: string;
  messages: ChatMessageDetail[];
}

export const chatAPI = {
  sendMessage: async (payload: SendMessagePayload) => {
    // Normalize session_id to number or null if numeric string provided
    const session_id = payload.session_id !== undefined && payload.session_id !== null && !isNaN(Number(payload.session_id))
      ? Number(payload.session_id)
      : null;
      
    const reqBody: any = {
      message: payload.message,
    };
    if (session_id !== null) {
      reqBody.session_id = session_id;
    }
    if (payload.response_language || payload.language) {
      reqBody.response_language = payload.response_language || payload.language;
    }

    const { data } = await apiClient.post('/chat', reqBody);
    return data;
  },

  getHistory: async (): Promise<ChatHistoryResponse> => {
    const { data } = await apiClient.get('/chat/history');
    return data;
  },

  getSession: async (sessionId: number | string): Promise<ChatSessionDetailResponse> => {
    const { data } = await apiClient.get(`/chat/session/${sessionId}`);
    return data;
  },

  setSessionLanguage: async (sessionId: number | string, response_language: string) => {
    const { data } = await apiClient.patch(`/chat/session/${sessionId}/language`, {
      response_language,
    });
    return data;
  },

  deleteHistory: async () => {
    const { data } = await apiClient.delete('/chat/history');
    return data;
  },

  sendVoiceMessage: async (audioFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    const { data } = await apiClient.post('/chat/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
