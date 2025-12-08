<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Minhas Tarefas</span>
            <div>
              <span class="text-body-2 mr-4">{{ authStore.user?.name }}</span>
              <v-btn color="error" variant="text" @click="handleLogout">
                Sair
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="showDialog = true"
              class="mb-4"
            >
              Nova Tarefa
            </v-btn>

            <v-alert
              v-if="taskStore.error"
              type="error"
              class="mb-4"
              closable
              @click:close="taskStore.clearError()"
            >
              {{ taskStore.error }}
            </v-alert>

            <v-progress-linear
              v-if="taskStore.loading"
              indeterminate
              color="primary"
              class="mb-4"
            />

            <v-list v-if="!taskStore.loading && taskStore.tasks.length > 0">
              <v-list-item
                v-for="task in taskStore.tasks"
                :key="task.id"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-checkbox
                    :model-value="task.completed"
                    @update:model-value="toggleTask(task)"
                    color="primary"
                  />
                </template>
                <v-list-item-title
                  :class="{ 'text-decoration-line-through': task.completed }"
                >
                  {{ task.title }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="task.description">
                  {{ task.description }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    @click="editTask(task)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click="deleteTask(task.id)"
                  />
                </template>
              </v-list-item>
            </v-list>

            <v-alert
              v-if="!taskStore.loading && taskStore.tasks.length === 0"
              type="info"
            >
              Nenhuma tarefa cadastrada. Clique em "Nova Tarefa" para começar.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para criar/editar tarefa -->
    <v-dialog v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ editingTask ? 'Editar Tarefa' : 'Nova Tarefa' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveTask">
            <v-text-field
              v-model="taskForm.title"
              label="Título"
              :rules="[rules.required]"
              required
              class="mb-4"
            />
            <v-textarea
              v-model="taskForm.description"
              label="Descrição"
              rows="3"
              class="mb-4"
            />
            <v-checkbox
              v-model="taskForm.completed"
              label="Concluída"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="saveTask" :loading="taskStore.loading">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/tasks'
import type { Task, TaskRequest } from '../types/task'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const showDialog = ref(false)
const editingTask = ref<Task | null>(null)
const taskForm = ref<TaskRequest>({
  title: '',
  description: '',
  completed: false,
})

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await taskStore.fetchAll()
})

function editTask(task: Task) {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    completed: task.completed,
  }
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    completed: false,
  }
}

async function saveTask() {
  if (!taskForm.value.title) {
    return
  }

  try {
    if (editingTask.value) {
      await taskStore.update(editingTask.value.id, taskForm.value)
    } else {
      await taskStore.create(taskForm.value)
    }
    closeDialog()
  } catch (error) {
    // Error já é tratado no store
  }
}

async function toggleTask(task: Task) {
  try {
    await taskStore.update(task.id, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
    })
  } catch (error) {
    // Error já é tratado no store
  }
}

async function deleteTask(id: string) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    try {
      await taskStore.remove(id)
    } catch (error) {
      // Error já é tratado no store
    }
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

