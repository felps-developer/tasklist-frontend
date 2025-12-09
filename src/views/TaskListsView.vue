<template>
  <PageContainer>
    <template #header>
      <TasksHeader
        title="Minhas Listas de Tarefas"
        :user-name="authStore.user?.name"
        @logout="handleLogout"
      />
    </template>

    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openListDialog" size="large">
        Nova Lista
      </v-btn>
    </div>

    <v-text-field
      v-model="searchName"
      label="Buscar por nome"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-4"
      @update:model-value="handleSearch"
      @click:clear="handleSearch"
    />

    <v-alert
      v-if="taskListStore.error"
      type="error"
      class="mb-4"
      closable
      @click:close="taskListStore.clearError()"
    >
      {{ taskListStore.error }}
    </v-alert>

    <v-progress-linear v-if="taskListStore.loading" indeterminate color="primary" class="mb-4" />

    <TaskListTable
      v-if="!taskListStore.loading && taskListStore.taskLists.length > 0"
      :task-lists="taskListStore.taskLists"
      @item-click="goToTasks"
      @edit="openListDialog"
      @delete="openDeleteDialog"
    />

    <v-alert v-if="!taskListStore.loading && taskListStore.taskLists.length === 0" type="info">
      <span v-if="searchName">Nenhuma lista encontrada com o nome "{{ searchName }}".</span>
      <span v-else>Nenhuma lista cadastrada. Clique em "Nova Lista" para começar.</span>
    </v-alert>

    <!-- Paginação -->
    <div
      v-if="
        taskListStore.pagination &&
        taskListStore.pagination.totalPages > 1 &&
        !taskListStore.loading
      "
      class="d-flex justify-center mt-4"
    >
      <v-pagination
        v-model="currentPage"
        :length="taskListStore.pagination.totalPages"
        :total-visible="7"
        @update:model-value="handlePageChange"
      />
    </div>

    <!-- Dialog para criar/editar lista -->
    <TaskListRegisterDialog
      v-model="showListDialog"
      :task-list="taskListToEdit"
      @saved="handleListSaved"
      @closed="handleListDialogClosed"
    />

    <!-- Dialog para confirmar exclusão de lista -->
    <DeleteTaskListDialog
      v-model="showDeleteDialog"
      :task-list-name="taskListToDelete?.name"
      :loading="taskListStore.loading"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTaskListStore } from '../stores/taskLists'
import PageContainer from '@/components/PageContainer.vue'
import TasksHeader from '@/components/TasksHeader.vue'
import TaskListTable from '@/components/TaskListTable.vue'
import TaskListRegisterDialog from '@/components/TaskListRegisterDialog.vue'
import DeleteTaskListDialog from '@/components/DeleteTaskListDialog.vue'
import type { TaskList } from '../types/taskList'

const router = useRouter()
const authStore = useAuthStore()
const taskListStore = useTaskListStore()

const showListDialog = ref(false)
const taskListToEdit = ref<TaskList | null>(null)
const showDeleteDialog = ref(false)
const taskListToDelete = ref<TaskList | null>(null)
const searchName = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

onMounted(async () => {
  authStore.loadFromStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await taskListStore.fetchAll(0, pageSize.value)
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
  await taskListStore.fetchAll(page, pageSize.value, searchName.value || undefined)
}

function openListDialog(list?: TaskList) {
  // Se não passar lista, é criação (null), senão é edição (lista com id)
  taskListToEdit.value = list || null
  showListDialog.value = true
}

function handleListSaved() {
  loadPage(currentPage.value - 1)
}

function handleListDialogClosed() {
  taskListToEdit.value = null
}

function goToTasks(listId: string) {
  router.push(`/tasks/${listId}`)
}

function openDeleteDialog(list: TaskList) {
  taskListToDelete.value = list
  showDeleteDialog.value = true
}

function cancelDelete() {
  taskListToDelete.value = null
  showDeleteDialog.value = false
}

async function confirmDelete() {
  if (!taskListToDelete.value) {
    return
  }

  try {
    await taskListStore.remove(taskListToDelete.value.id)
    cancelDelete()
    // Recarregar página atual ou voltar para página anterior se a atual ficou vazia
    const currentItems = taskListStore.taskLists.length
    if (currentItems === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
    }
    loadPage(currentPage.value - 1)
  } catch {
    // Error já é tratado no store
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
