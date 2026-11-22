/**
 * Centralized TypeScript Interface & DTO Definitions
 */

export * from './analysis';
export * from './dashboard';
export * from './history';

// --- User & Auth ---

export interface User {
  id: number | string;
  username: string;
  email: string;
  full_name?: string;
  name?: string;
  role?: 'farmer' | 'researcher' | 'admin' | string;
  preferred_language?: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  profile_picture?: string;
  created_at?: string;
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password?: string;
  full_name?: string;
  role?: string;
  preferred_language?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  user?: User;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  updateUser?: (data: Partial<User>) => void;
}

// --- Soil Analysis & Prediction ---

export interface SoilInputData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  state?: string;
  district?: string;
  city?: string;
}

export interface CropRecommendationResult {
  recommended_crop: string;
  confidence: number;
  soil_health_score: number;
  soil_fertility: string;
  soil_health_class: string;
  suitable_crops?: Array<{ crop: string; score: number }>;
  npk_status?: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
}

export interface FertilizerInputData {
  crop_type: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soil_type?: string;
}

export interface FertilizerRecommendationResult {
  fertilizer_name: string;
  dosage: string;
  application_method?: string;
  organic_alternatives?: string[];
  precautions?: string[];
}

// --- Chatbot ---

export interface ChatMessage {
  id?: string | number;
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string | number;
  image?: string;
  audio?: string;
  confidence?: number;
}

// --- API Common Wrappers ---

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiErrorResponse {
  detail?: string | Array<{ loc: string[]; msg: string; type: string }>;
  message?: string;
  status_code?: number;
}
