<template>
  <v-list v-if="taskLists.length > 0" class="pa-0">
    <v-list-item
      v-for="list in taskLists"
      :key="list.id"
      class="mb-2 border rounded"
      @click="$emit('item-click', list.id)"
      style="cursor: pointer"
    >
      <template v-slot:prepend>
        <v-icon color="primary" size="large">mdi-format-list-bulleted</v-icon>
      </template>
      <v-list-item-title class="text-wrap">
        {{ list.name }}
      </v-list-item-title>
      <v-list-item-subtitle>
        Criada em {{ formatDate(list.createdAt) }}
      </v-list-item-subtitle>
      <template v-slot:append>
        <div class="d-flex">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            @click.stop="$emit('edit', list)"
            class="mr-1"
          />
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
            @click.stop="$emit('delete', list)"
          />
        </div>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import type { TaskList } from '../types/taskList'

interface Props {
  taskLists: TaskList[]
}

interface Emits {
  (e: 'item-click', id: string): void
  (e: 'edit', list: TaskList): void
  (e: 'delete', list: TaskList): void
}

defineProps<Props>()
defineEmits<Emits>()

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

