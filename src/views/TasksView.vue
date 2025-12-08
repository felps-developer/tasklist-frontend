<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" md="10" lg="8" xl="6" class="mx-auto">
        <v-card>
          <TasksHeader :user-name="authStore.user?.name" @logout="handleLogout" />
          <v-card-text class="pa-4">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openTaskDialog"
              class="mb-4"
              block
              size="large"
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

            <v-list v-if="!taskStore.loading && taskStore.tasks.length > 0" class="pa-0">
              <v-list-item
                v-for="task in taskStore.tasks"
                :key="task.id"
                class="mb-2 border rounded"
              >
                <template v-slot:prepend>
                  <v-checkbox
                    :model-value="task.completed"
                    @update:model-value="toggleTask(task)"
                    color="primary"
                    class="ma-0"
                  />
                </template>
                <v-list-item-title
                  :class="{ 'text-decoration-line-through': task.completed }"
                  class="text-wrap"
                >
                  {{ task.title }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="task.description" class="text-wrap">
                  {{ task.description }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <div class="d-flex">
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      size="small"
                      @click="openTaskDialog(task)"
                      class="mr-1"
                    />
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      size="small"
                      color="error"
                      @click="openDeleteDialog(task)"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <v-alert v-if="!taskStore.loading && taskStore.tasks.length === 0" type="info">
              Nenhuma tarefa cadastrada. Clique em "Nova Tarefa" para começar.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para criar/editar tarefa -->
    <TaskRegisterDialog
      v-model="showTaskDialog"
      :task="taskToEdit"
      @saved="handleTaskSaved"
      @closed="handleTaskDialogClosed"
    />

    <!-- Dialog para confirmar exclusão de tarefa -->
    <DeleteTaskDialog
      v-model="showDeleteDialog"
      :task-title="taskToDelete?.title"
      :loading="taskStore.loading"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/tasks'
import TasksHeader from '../components/TasksHeader.vue'
import TaskRegisterDialog from '../components/TaskRegisterDialog.vue'
import DeleteTaskDialog from '../components/DeleteTaskDialog.vue'
import type { Task } from '../types/task'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const showTaskDialog = ref(false)
const taskToEdit = ref<Task | null>(null)
const showDeleteDialog = ref(false)
const taskToDelete = ref<Task | null>(null)

onMounted(async () => {
  authStore.loadFromStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await taskStore.fetchAll()
})

function openTaskDialog(task?: Task) {
  taskToEdit.value = task || null
  showTaskDialog.value = true
}

function handleTaskSaved() {
  taskStore.fetchAll()
}

function handleTaskDialogClosed() {
  taskToEdit.value = null
}

async function toggleTask(task: Task) {
  try {
    await taskStore.update(task.id, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
    })
  } catch {
    // Error já é tratado no store
  }
}

function openDeleteDialog(task: Task) {
  taskToDelete.value = task
  showDeleteDialog.value = true
}

function cancelDelete() {
  taskToDelete.value = null
  showDeleteDialog.value = false
}

async function confirmDelete() {
  if (!taskToDelete.value) {
    return
  }

  try {
    await taskStore.remove(taskToDelete.value.id)
    cancelDelete()
  } catch {
    // Error já é tratado no store
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
