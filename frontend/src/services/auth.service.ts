/**
 * Auth Service
 * High-level authentication service encapsulating user session, login, signup, logout.
 */

import { loginUser as apiLogin, registerUser as apiRegister } from '../api/auth';
import { TokenService } from './token.service';
import { StorageService } from './storage.service';
import { LoginCredentials, RegisterData, AuthResponse } from '../types';

const USER_STORAGE_KEY = 'user';

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await apiLogin(credentials);
    if (data.access_token) {
      TokenService.setTokens(data.access_token, data.refresh_token);
    }
    if (data.user) {
      StorageService.setItem(USER_STORAGE_KEY, data.user);
    }
    return data;
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const data = await apiRegister(registerData);
    if (data.access_token) {
      TokenService.setTokens(data.access_token, data.refresh_token);
    }
    if (data.user) {
      StorageService.setItem(USER_STORAGE_KEY, data.user);
    }
    return data;
  },

  logout(): void {
    TokenService.clearTokens();
    StorageService.removeItem(USER_STORAGE_KEY);
    window.dispatchEvent(new Event('auth-logout'));
  },

  getCurrentUser<T>(): T | null {
    return StorageService.getItem<T>(USER_STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(TokenService.getAccessToken());
  },
};

export default AuthService;
