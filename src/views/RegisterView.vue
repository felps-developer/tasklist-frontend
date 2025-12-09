<template>
  <v-container fluid class="fill-height pa-0">
    <v-row align="center" justify="center" class="fill-height ma-0">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-4">
        <v-card class="mx-auto" max-width="500">
          <v-card-title class="text-h5 text-center pa-6"> Cadastro </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="name"
                label="Nome"
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                required
                class="mb-4"
              />
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
                :rules="[rules.required, rules.minLength]"
                required
                class="mb-4"
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirmar Senha"
                type="password"
                prepend-inner-icon="mdi-lock-check"
                :rules="[rules.required, rules.passwordMatch]"
                required
                class="mb-4"
              />
              <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
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
                Cadastrar
              </v-btn>
              <v-divider class="my-4" />
              <div class="text-center">
                <span class="text-body-2">Já tem uma conta? </span>
                <router-link to="/login" class="text-primary text-decoration-none">
                  Faça login
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Email inválido'
  },
  minLength: (value: string) => value.length >= 6 || 'Senha deve ter no mínimo 6 caracteres',
  passwordMatch: (value: string) => value === password.value || 'As senhas não coincidem',
}

async function handleRegister() {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Preencha todos os campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    router.push('/')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
