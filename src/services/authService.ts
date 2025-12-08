import { apiService } from './api'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth'

export const authService = {
  async register(data: RegisterRequest): Promise<void> {
    await apiService.post('/auth/register', data)
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me')
    return response.data
  },
}

