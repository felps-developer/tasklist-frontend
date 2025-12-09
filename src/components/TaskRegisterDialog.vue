<template>
  <v-dialog v-model="dialog" max-width="600" persistent scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h5">{{ isEditing ? 'Editar Tarefa' : 'Nova Tarefa' }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="handleClose" :disabled="taskStore.loading" />
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
        <v-btn variant="text" @click="handleClose" :disabled="taskStore.loading"> Cancelar </v-btn>
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
  taskListId?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
  (e: 'closed'): void
}

const props = withDefaults(defineProps<Props>(), {
  task: null,
  taskListId: undefined,
})

const emit = defineEmits<Emits>()

const taskStore = useTaskStore()
const formRef = ref()

const dialog = ref(false)
const taskForm = ref<TaskRequest>({
  title: '',
  description: '',
  completed: false,
  taskListId: undefined,
})

const isEditing = computed(() => {
  return props.task !== null && props.task !== undefined && !!props.task.id
})

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
}

// Helper para obter taskListId válido
function getValidTaskListId(): string | undefined {
  if (props.taskListId && props.taskListId !== 'undefined' && props.taskListId !== 'null') {
    return props.taskListId
  }
  if (props.task?.taskListId) {
    return props.task.taskListId
  }
  return undefined
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (dialog.value !== newValue) {
      dialog.value = newValue
    }
    if (newValue) {
      loadTaskData()
    }
  },
)

watch(
  () => props.taskListId,
  () => {
    if (dialog.value && !isEditing.value) {
      // Se o dialog estiver aberto e não estiver editando, atualiza o taskListId
      taskForm.value.taskListId = getValidTaskListId()
    }
  },
)

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
      taskListId: getValidTaskListId(),
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
    taskListId: getValidTaskListId(),
  }
}

function handleClose() {
  dialog.value = false
}

async function saveTask() {
  if (!taskForm.value.title) {
    return
  }

  // Garantir que taskListId está definido
  const taskListId = getValidTaskListId()
  if (!isEditing.value && taskListId) {
    taskForm.value.taskListId = taskListId
  }

  try {
    // Se tem id, é edição (PUT), senão é criação (POST)
    if (isEditing.value && props.task?.id) {
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
