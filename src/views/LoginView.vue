<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card>
          <v-card-title class="text-h5 text-center pa-6">
            Login
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                required
                class="mb-4"
              />
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                prepend-inner-icon="mdi-lock"
                :rules="[rules.required]"
                required
                class="mb-4"
              />
              <v-alert
                v-if="error"
                type="error"
                class="mb-4"
                closable
                @click:close="error = ''"
              >
                {{ error }}
              </v-alert>
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                class="mb-4"
              >
                Entrar
              </v-btn>
              <v-divider class="my-4" />
              <div class="text-center">
                <span class="text-body-2">Não tem uma conta? </span>
                <router-link to="/register" class="text-primary text-decoration-none">
                  Cadastre-se
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Email inválido'
  },
}

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Preencha todos os campos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })
    router.push('/tasks')
  } catch (err: any) {
    error.value = err.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>

