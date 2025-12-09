import { ref } from 'vue'
import { defineStore } from 'pinia'
import { taskService } from '../services/taskService'
import type { Task, TaskRequest, PageResponse } from '../types/task'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PageResponse<Task> | null>(null)

  async function fetchAll(page: number = 0, size: number = 10, taskListId?: string, title?: string) {
    loading.value = true
    error.value = null
    try {
      const pageResponse = await taskService.getAll(page, size, taskListId, title)
      tasks.value = pageResponse.content
      pagination.value = pageResponse
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar tarefas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAllWithoutPagination(taskListId?: string, title?: string) {
    loading.value = true
    error.value = null
    try {
      tasks.value = await taskService.getAllWithoutPagination(taskListId, title)
      pagination.value = null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar tarefas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    error.value = null
    try {
      const task = await taskService.getById(id)
      return task
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar tarefa'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(data: TaskRequest) {
    loading.value = true
    error.value = null
    try {
      const newTask = await taskService.create(data)
      tasks.value.push(newTask)
      return newTask
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar tarefa'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: TaskRequest) {
    loading.value = true
    error.value = null
    try {
      const updatedTask = await taskService.update(id, data)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar tarefa'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    error.value = null
    try {
      await taskService.delete(id)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao excluir tarefa'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    tasks,
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

