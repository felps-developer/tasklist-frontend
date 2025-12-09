<template>
  <v-dialog v-model="dialog" max-width="600" persistent scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h5">{{ isEditing ? 'Editar Lista' : 'Nova Lista' }}</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="handleClose"
          :disabled="taskListStore.loading"
        />
      </v-card-title>
      <v-card-text class="pa-4">
        <v-alert
          v-if="taskListStore.error"
          type="error"
          class="mb-4"
          closable
          @click:close="taskListStore.clearError()"
        >
          {{ taskListStore.error }}
        </v-alert>
        <v-form ref="formRef" @submit.prevent="saveList">
          <v-text-field
            v-model="listForm.name"
            label="Nome da Lista"
            :rules="[rules.required]"
            required
            class="mb-4"
            :disabled="taskListStore.loading"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleClose"
          :disabled="taskListStore.loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="saveList"
          :loading="taskListStore.loading"
          :disabled="!listForm.name"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useTaskListStore } from '../stores/taskLists'
import type { TaskList, TaskListRequest } from '../types/taskList'

interface Props {
  modelValue: boolean
  taskList?: TaskList | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
  (e: 'closed'): void
}

const props = withDefaults(defineProps<Props>(), {
  taskList: null,
})

const emit = defineEmits<Emits>()

const taskListStore = useTaskListStore()
const formRef = ref()

const dialog = ref(false)
const listForm = ref<TaskListRequest>({
  name: '',
})

const isEditing = computed(() => {
  return props.taskList !== null && props.taskList !== undefined && !!props.taskList.id
})

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
}

watch(() => props.modelValue, (newValue) => {
  if (dialog.value !== newValue) {
    dialog.value = newValue
  }
  if (newValue) {
    loadListData()
  } else {
    resetForm()
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

watch(() => props.taskList, () => {
  if (dialog.value) {
    loadListData()
  }
})

function loadListData() {
  if (props.taskList) {
    listForm.value = {
      name: props.taskList.name,
    }
  } else {
    resetForm()
  }
}

function resetForm() {
  listForm.value = {
    name: '',
  }
}

function handleClose() {
  dialog.value = false
}

async function saveList() {
  if (!listForm.value.name) {
    return
  }

  try {
    // Se tem id, é edição (PUT), senão é criação (POST)
    if (isEditing.value && props.taskList?.id) {
      await taskListStore.update(props.taskList.id, listForm.value)
    } else {
      await taskListStore.create(listForm.value)
    }
    emit('saved')
    dialog.value = false
  } catch {
    // Error já é tratado no store
  }
}
</script>

