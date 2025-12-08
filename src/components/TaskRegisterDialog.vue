<template>
  <v-dialog v-model="dialog" max-width="600" persistent scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h5">{{ isEditing ? 'Editar Tarefa' : 'Nova Tarefa' }}</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="handleClose"
          :disabled="taskStore.loading"
        />
      </v-card-title>
      <v-card-text class="pa-4">
        <v-alert
          v-if="taskStore.error"
          type="error"
          class="mb-4"
          closable
          @click:close="taskStore.clearError()"
        >
          {{ taskStore.error }}
        </v-alert>

        <v-form ref="formRef" @submit.prevent="saveTask">
          <v-text-field
            v-model="taskForm.title"
            label="Título"
            :rules="[rules.required]"
            required
            class="mb-4"
            :disabled="taskStore.loading"
          />
          <v-textarea
            v-model="taskForm.description"
            label="Descrição"
            rows="5"
            class="mb-4"
            :disabled="taskStore.loading"
          />
          <v-checkbox
            v-model="taskForm.completed"
            label="Concluída"
            :disabled="taskStore.loading"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleClose"
          :disabled="taskStore.loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="saveTask"
          :loading="taskStore.loading"
          :disabled="!taskForm.title"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useTaskStore } from '../stores/tasks'
import type { Task, TaskRequest } from '../types/task'

interface Props {
  modelValue: boolean
  task?: Task | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
  (e: 'closed'): void
}

const props = withDefaults(defineProps<Props>(), {
  task: null,
})

const emit = defineEmits<Emits>()

const taskStore = useTaskStore()
const formRef = ref()

const dialog = ref(props.modelValue)
const taskForm = ref<TaskRequest>({
  title: '',
  description: '',
  completed: false,
})

const isEditing = computed(() => !!props.task)

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
}

watch(() => props.modelValue, (newValue) => {
  if (dialog.value !== newValue) {
    dialog.value = newValue
  }
  if (newValue) {
    loadTaskData()
  }
})

watch(dialog, (newValue) => {
  if (props.modelValue !== newValue) {
    emit('update:modelValue', newValue)
  }
  if (!newValue) {
    emit('closed')
    resetForm()
  }
})

function loadTaskData() {
  if (props.task) {
    taskForm.value = {
      title: props.task.title,
      description: props.task.description || '',
      completed: props.task.completed,
    }
  } else {
    resetForm()
  }
}

function resetForm() {
  taskForm.value = {
    title: '',
    description: '',
    completed: false,
  }
}

function handleClose() {
  dialog.value = false
}

async function saveTask() {
  if (!taskForm.value.title) {
    return
  }

  try {
    if (isEditing.value && props.task) {
      await taskStore.update(props.task.id, taskForm.value)
    } else {
      await taskStore.create(taskForm.value)
    }
    emit('saved')
    dialog.value = false
  } catch {
    // Error já é tratado no store
  }
}
</script>

