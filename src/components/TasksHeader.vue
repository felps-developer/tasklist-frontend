<template>
  <v-card-title
    class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center pa-4"
  >
    <span class="text-h5 mb-2 mb-sm-0">{{ title }}</span>
    <div class="d-flex align-center flex-wrap">
      <span v-if="userName" class="text-body-2 mr-2 mr-sm-4 d-none d-sm-inline">
        {{ userName }}
      </span>
      <v-btn
        color="error"
        variant="text"
        size="small"
        @click="$emit('logout')"
        class="mt-1 mt-sm-0"
      >
        <span class="d-none d-sm-inline">Sair</span>
        <v-icon class="d-sm-none">mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  userName?: string
}

interface Emits {
  (e: 'logout'): void
}

withDefaults(defineProps<Props>(), {
  title: 'Minhas Tarefas',
  userName: '',
})

defineEmits<Emits>()
</script>

