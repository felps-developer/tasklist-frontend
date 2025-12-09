<template>
  <div v-if="tasks.length > 0" class="pa-0">
    <v-card v-for="task in tasks" :key="task.id" class="mb-2" variant="outlined">
      <v-card-text class="pa-3">
        <div class="d-flex align-center">
          <v-checkbox
            :model-value="task.completed"
            @update:model-value="$emit('toggle', task)"
            color="primary"
            class="ma-0 mr-3"
            density="compact"
            hide-details
          />
          <v-row no-gutters class="flex-grow-1 align-center">
            <v-col cols="12" md="4" class="pr-md-2">
              <div class="text-caption text-medium-emphasis mb-1">Título</div>
              <div
                :class="{ 'text-decoration-line-through': task.completed }"
                class="text-body-1 font-weight-medium"
              >
                {{ task.title }}
              </div>
            </v-col>
            <v-col cols="12" md="8" class="pl-md-2">
              <div class="text-caption text-medium-emphasis mb-1">Descrição</div>
              <div v-if="task.description" class="text-body-2 text-medium-emphasis">
                <span v-if="!isDescriptionLong(task.description)">
                  {{ task.description }}
                </span>
                <span v-else>
                  {{ truncateDescription(task.description) }}
                  <v-btn
                    icon="mdi-eye"
                    variant="text"
                    size="x-small"
                    @click="$emit('view-description', task.description)"
                    class="ml-1"
                    color="primary"
                  />
                </span>
              </div>
              <div v-else class="text-body-2 text-grey-lighten-1">Sem descrição</div>
            </v-col>
          </v-row>
          <div class="d-flex align-center ml-3">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="$emit('edit', task)"
              class="mr-1"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="$emit('delete', task)"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types/task'

interface Props {
  tasks: Task[]
}

interface Emits {
  (e: 'toggle', task: Task): void
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
  (e: 'view-description', description: string): void
}

defineProps<Props>()
defineEmits<Emits>()

function isDescriptionLong(description: string): boolean {
  return !!(description && description.length > 100)
}

function truncateDescription(description: string): string {
  if (!description) return ''
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}
</script>
