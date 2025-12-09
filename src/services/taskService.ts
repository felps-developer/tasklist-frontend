import { apiService } from './api'
import type { Task, TaskRequest, PageResponse } from '../types/task'

export const taskService = {
  async getAll(page: number = 0, size: number = 10, taskListId?: string, title?: string): Promise<PageResponse<Task>> {
    const params: any = { page, size }
    if (taskListId && taskListId !== 'undefined' && taskListId.trim() !== '') {
      params.taskListId = taskListId
    }
    if (title && title.trim() !== '') {
      params.title = title
    }
    const response = await apiService.get<PageResponse<Task>>('/tasks', { params })
    return response.data
  },

  async getAllWithoutPagination(taskListId?: string, title?: string): Promise<Task[]> {
    const params: any = {}
    if (taskListId && taskListId !== 'undefined' && taskListId.trim() !== '') {
      params.taskListId = taskListId
    }
    if (title && title.trim() !== '') {
      params.title = title
    }
    const response = await apiService.get<Task[]>('/tasks/all', { params })
    return response.data
  },

  async getById(id: string): Promise<Task> {
    if (!id || id === 'undefined' || id.trim() === '') {
      throw new Error('ID da tarefa é obrigatório')
    }
    const response = await apiService.get<Task>(`/tasks/${id}`)
    return response.data
  },

  async create(data: TaskRequest): Promise<Task> {
    const response = await apiService.post<Task>('/tasks', data)
    return response.data
  },

  async update(id: string, data: TaskRequest): Promise<Task> {
    if (!id || id === 'undefined' || id.trim() === '') {
      throw new Error('ID da tarefa é obrigatório')
    }
    const response = await apiService.put<Task>(`/tasks/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    if (!id || id === 'undefined' || id.trim() === '') {
      throw new Error('ID da tarefa é obrigatório')
    }
    await apiService.delete(`/tasks/${id}`)
  },
}

