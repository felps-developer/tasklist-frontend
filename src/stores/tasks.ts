import { ref } from 'vue'
import { defineStore } from 'pinia'
import { taskService } from '../services/taskService'
import type { Task, TaskRequest } from '../types/task'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await taskService.getAll()
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
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    clearError,
  }
})

