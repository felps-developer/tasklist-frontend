import { ref } from 'vue'
import { defineStore } from 'pinia'
import { taskListService } from '../services/taskListService'
import type { TaskList, TaskListRequest, PageResponse } from '../types/taskList'

export const useTaskListStore = defineStore('taskLists', () => {
  const taskLists = ref<TaskList[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PageResponse<TaskList> | null>(null)

  async function fetchAll(page: number = 0, size: number = 10, name?: string) {
    loading.value = true
    error.value = null
    try {
      const pageResponse = await taskListService.getAll(page, size, name)
      taskLists.value = pageResponse.content
      pagination.value = pageResponse
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar listas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAllWithoutPagination(name?: string) {
    loading.value = true
    error.value = null
    try {
      taskLists.value = await taskListService.getAllWithoutPagination(name)
      pagination.value = null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar listas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    error.value = null
    try {
      const taskList = await taskListService.getById(id)
      return taskList
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar lista'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(data: TaskListRequest) {
    loading.value = true
    error.value = null
    try {
      const newList = await taskListService.create(data)
      taskLists.value.push(newList)
      return newList
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar lista'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: TaskListRequest) {
    loading.value = true
    error.value = null
    try {
      const updatedList = await taskListService.update(id, data)
      const index = taskLists.value.findIndex((l) => l.id === id)
      if (index !== -1) {
        taskLists.value[index] = updatedList
      }
      return updatedList
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar lista'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    error.value = null
    try {
      await taskListService.delete(id)
      taskLists.value = taskLists.value.filter((l) => l.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao excluir lista'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    taskLists,
    loading,
    error,
    pagination,
    fetchAll,
    fetchAllWithoutPagination,
    fetchById,
    create,
    update,
    remove,
    clearError,
  }
})

