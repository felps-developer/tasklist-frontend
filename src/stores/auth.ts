import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import type { LoginRequest, RegisterRequest, User } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  // Carregar dados do localStorage ao inicializar
  function loadFromStorage() {
    const storedUser = localStorage.getItem('user')
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedUser && storedAccessToken) {
      user.value = JSON.parse(storedUser)
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken
    }
  }

  async function register(data: RegisterRequest) {
    try {
      await authService.register(data)
      // Após registro, fazer login automaticamente
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password,
      })
      // Usar os dados do usuário da resposta (o backend agora retorna isso)
      if (loginResponse.user) {
        await setAuth(loginResponse, loginResponse.user)
      } else {
        // Fallback: usar dados do registro
        await setAuth(loginResponse, { id: '', name: data.name, email: data.email })
      }
      return loginResponse
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Erro ao registrar usuário'
      throw new Error(errorMessage || 'Erro ao registrar usuário')
    }
  }

  async function login(data: LoginRequest) {
    try {
      const response = await authService.login(data)
      // Salvar o token primeiro
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      // Usar os dados do usuário da resposta (o backend agora retorna isso)
      if (response.user) {
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
      } else {
        // Fallback: usar dados básicos do email (não chamar /me para evitar erro)
        user.value = { id: '', name: data.email.split('@')[0] || data.email, email: data.email }
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      return response
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Credenciais inválidas'
      throw new Error(errorMessage || 'Credenciais inválidas')
    }
  }

  async function setAuth(
    authResponse: { accessToken: string; refreshToken: string },
    userData: User,
  ) {
    accessToken.value = authResponse.accessToken
    refreshToken.value = authResponse.refreshToken
    user.value = userData

    localStorage.setItem('accessToken', authResponse.accessToken)
    localStorage.setItem('refreshToken', authResponse.refreshToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  // Inicializar ao criar a store
  loadFromStorage()

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    register,
    login,
    logout,
    loadFromStorage,
  }
})
