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
      await setAuth(loginResponse, { name: data.name, email: data.email, id: '' })
      return loginResponse
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao registrar usuário')
    }
  }

  async function login(data: LoginRequest) {
    try {
      const response = await authService.login(data)
      // Buscar dados do usuário do token ou fazer uma requisição adicional
      await setAuth(response, { name: '', email: data.email, id: '' })
      return response
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Credenciais inválidas')
    }
  }

  async function setAuth(authResponse: any, userData: User) {
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

