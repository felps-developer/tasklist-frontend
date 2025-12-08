import { apiService } from './api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

export const authService = {
  async register(data: RegisterRequest): Promise<void> {
    await apiService.post('/auth/register', data)
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', data)
    return response.data
  },
}

