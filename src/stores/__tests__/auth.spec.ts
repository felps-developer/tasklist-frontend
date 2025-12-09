import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import { authService } from '../../services/authService'
import type { AuthResponse, User } from '../../types/auth'

vi.mock('../../services/authService')

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('loadFromStorage', () => {
    it('deve carregar dados do localStorage quando existem', () => {
      const user: User = { id: '1', name: 'Test User', email: 'test@example.com' }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('accessToken', 'token123')
      localStorage.setItem('refreshToken', 'refresh123')

      const store = useAuthStore()
      store.loadFromStorage()

      expect(store.user).toEqual(user)
      expect(store.accessToken).toBe('token123')
      expect(store.refreshToken).toBe('refresh123')
      expect(store.isAuthenticated).toBe(true)
    })

    it('não deve carregar dados quando localStorage está vazio', () => {
      const store = useAuthStore()
      store.loadFromStorage()

      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(store.refreshToken).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockResponse: AuthResponse = {
        accessToken: 'token123',
        refreshToken: 'refresh123',
        tokenType: 'Bearer',
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      }

      vi.mocked(authService.login).mockResolvedValue(mockResponse)

      const store = useAuthStore()
      await store.login({ email: 'test@example.com', password: 'password123' })

      expect(store.accessToken).toBe('token123')
      expect(store.refreshToken).toBe('refresh123')
      expect(store.user).toEqual(mockResponse.user)
      expect(store.isAuthenticated).toBe(true)
      expect(localStorage.getItem('accessToken')).toBe('token123')
      expect(localStorage.getItem('refreshToken')).toBe('refresh123')
    })

    it('deve lançar erro quando login falha', async () => {
      const error = new Error('Credenciais inválidas')
      vi.mocked(authService.login).mockRejectedValue(error)

      const store = useAuthStore()

      await expect(store.login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('register', () => {
    it('deve registrar e fazer login automaticamente', async () => {
      const registerData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      }

      const mockLoginResponse: AuthResponse = {
        accessToken: 'token123',
        refreshToken: 'refresh123',
        tokenType: 'Bearer',
        user: { id: '1', name: 'New User', email: 'new@example.com' },
      }

      vi.mocked(authService.register).mockResolvedValue(undefined)
      vi.mocked(authService.login).mockResolvedValue(mockLoginResponse)

      const store = useAuthStore()
      await store.register(registerData)

      expect(authService.register).toHaveBeenCalledWith(registerData)
      expect(authService.login).toHaveBeenCalledWith({
        email: registerData.email,
        password: registerData.password,
      })
      expect(store.isAuthenticated).toBe(true)
      expect(store.user?.email).toBe('new@example.com')
    })

    it('deve lançar erro quando registro falha', async () => {
      const error = new Error('Email já existe')
      vi.mocked(authService.register).mockRejectedValue(error)

      const store = useAuthStore()

      await expect(
        store.register({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('deve limpar dados e localStorage', () => {
      const store = useAuthStore()
      store.user = { id: '1', name: 'Test', email: 'test@example.com' }
      store.accessToken = 'token123'
      store.refreshToken = 'refresh123'
      localStorage.setItem('accessToken', 'token123')
      localStorage.setItem('refreshToken', 'refresh123')
      localStorage.setItem('user', JSON.stringify(store.user))

      store.logout()

      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(store.refreshToken).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('deve retornar true quando há accessToken', () => {
      const store = useAuthStore()
      store.accessToken = 'token123'

      expect(store.isAuthenticated).toBe(true)
    })

    it('deve retornar false quando não há accessToken', () => {
      const store = useAuthStore()
      store.accessToken = null

      expect(store.isAuthenticated).toBe(false)
    })
  })
})
