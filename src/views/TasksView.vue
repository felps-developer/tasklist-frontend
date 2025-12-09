<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" md="10" lg="8" xl="6" class="mx-auto">
        <v-card>
          <TasksHeader
            :title="listTitle"
            :user-name="authStore.user?.name"
            @logout="handleLogout"
          />
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between align-center mb-4">
              <v-btn
                color="secondary"
                prepend-icon="mdi-arrow-left"
                @click="goBack"
                variant="outlined"
                size="large"
              >
                Voltar
              </v-btn>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="openTaskDialog" size="large">
                Nova Tarefa
              </v-btn>
            </div>

            <v-text-field
              v-model="searchTitle"
              label="Buscar por título"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              class="mb-4"
              @update:model-value="handleSearch"
              @click:clear="handleSearch"
            />

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

            <div v-if="!taskStore.loading && taskStore.tasks.length > 0" class="pa-0">
              <v-card
                v-for="task in taskStore.tasks"
                :key="task.id"
                class="mb-2"
                variant="outlined"
              >
                <v-card-text class="pa-3">
                  <div class="d-flex align-center">
                    <v-checkbox
                      :model-value="task.completed"
                      @update:model-value="toggleTask(task)"
                      color="primary"
                      class="ma-0 mr-3"
                      density="compact"
                      hide-details
                    />
                    <v-row no-gutters class="flex-grow-1 align-center">
                      <v-col cols="12" md="4" class="pr-md-2">
                        <div
                          :class="{ 'text-decoration-line-through': task.completed }"
                          class="text-body-1 font-weight-medium"
                        >
                          {{ task.title }}
                        </div>
                      </v-col>
                      <v-col cols="12" md="8" class="pl-md-2">
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
                              @click="openDescriptionDialog(task.description)"
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
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <v-alert v-if="!taskStore.loading && taskStore.tasks.length === 0" type="info">
              <span v-if="searchTitle"
                >Nenhuma tarefa encontrada com o título "{{ searchTitle }}".</span
              >
              <span v-else>Nenhuma tarefa cadastrada. Clique em "Nova Tarefa" para começar.</span>
            </v-alert>

            <!-- Paginação -->
            <div
              v-if="
                taskStore.pagination && taskStore.pagination.totalPages > 1 && !taskStore.loading
              "
              class="d-flex justify-center mt-4"
            >
              <v-pagination
                v-model="currentPage"
                :length="taskStore.pagination.totalPages"
                :total-visible="7"
                @update:model-value="handlePageChange"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para criar/editar tarefa -->
    <TaskRegisterDialog
      v-model="showTaskDialog"
      :task="taskToEdit"
      :task-list-id="taskListId"
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

    <!-- Dialog para mostrar descrição completa -->
    <TaskDescriptionDialog v-model="showDescriptionDialog" :description="selectedDescription" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/tasks'
import { useTaskListStore } from '../stores/taskLists'
import TasksHeader from '../components/TasksHeader.vue'
import TaskRegisterDialog from '../components/TaskRegisterDialog.vue'
import DeleteTaskDialog from '../components/DeleteTaskDialog.vue'
import TaskDescriptionDialog from '../components/TaskDescriptionDialog.vue'
import type { Task } from '../types/task'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const taskListStore = useTaskListStore()

const showTaskDialog = ref(false)
const taskToEdit = ref<Task | null>(null)
const showDeleteDialog = ref(false)
const taskToDelete = ref<Task | null>(null)
const showDescriptionDialog = ref(false)
const selectedDescription = ref('')
const searchTitle = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const taskListId = computed(() => {
  const id = route.params.id as string
  return id && id !== 'undefined' ? id : undefined
})
const listTitle = computed(() => {
  if (!taskListId.value) return 'Tarefas'
  const list = taskListStore.taskLists.find((l) => l.id === taskListId.value)
  return list ? list.name : 'Tarefas'
})

onMounted(async () => {
  authStore.loadFromStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Carregar lista atual se necessário
  if (taskListId.value) {
    try {
      await taskListStore.fetchById(taskListId.value)
    } catch {
      // Se não encontrar a lista, redirecionar
      router.push('/')
      return
    }
  }

  await taskStore.fetchAll(0, pageSize.value, taskListId.value || undefined)
  currentPage.value = 1
})

function handleSearch() {
  currentPage.value = 1
  loadPage(0)
}

function handlePageChange(page: number) {
  currentPage.value = page
  loadPage(page - 1)
}

async function loadPage(page: number) {
  await taskStore.fetchAll(
    page,
    pageSize.value,
    taskListId.value || undefined,
    searchTitle.value || undefined,
  )
}

function goBack() {
  router.push('/')
}

function openTaskDialog(task?: Task) {
  taskToEdit.value = task || null
  showTaskDialog.value = true
}

function handleTaskSaved() {
  loadPage(currentPage.value - 1)
}

function handleTaskDialogClosed() {
  taskToEdit.value = null
}

async function toggleTask(task: Task) {
  if (!task.id || task.id === 'undefined') {
    return
  }
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
  if (!taskToDelete.value || !taskToDelete.value.id || taskToDelete.value.id === 'undefined') {
    return
  }

  try {
    await taskStore.remove(taskToDelete.value.id)
    cancelDelete()
    loadPage(currentPage.value - 1)
  } catch {
    // Error já é tratado no store
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function isDescriptionLong(description: string): boolean {
  return !!(description && description.length > 100)
}

function truncateDescription(description: string): string {
  if (!description) return ''
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}

function openDescriptionDialog(description: string) {
  selectedDescription.value = description || ''
  showDescriptionDialog.value = true
}
</script>
