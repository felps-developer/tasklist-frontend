import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authService } from '../authService'
import { apiService } from '../api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth'

vi.mock('../api')

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('deve registrar novo usuário', async () => {
      const registerData: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      vi.mocked(apiService.post).mockResolvedValue({ data: undefined } as any)

      await authService.register(registerData)

      expect(apiService.post).toHaveBeenCalledWith('/auth/register', registerData)
    })
  })

  describe('login', () => {
    it('deve fazer login e retornar AuthResponse', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockResponse: AuthResponse = {
        accessToken: 'token123',
        refreshToken: 'refresh123',
        tokenType: 'Bearer',
      }

      vi.mocked(apiService.post).mockResolvedValue({ data: mockResponse } as any)

      const result = await authService.login(loginData)

      expect(apiService.post).toHaveBeenCalledWith('/auth/login', loginData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getCurrentUser', () => {
    it('deve buscar usuário atual', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      }

      vi.mocked(apiService.get).mockResolvedValue({ data: mockUser } as any)

      const result = await authService.getCurrentUser()

      expect(apiService.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })
  })
})

