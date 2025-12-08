import { apiService } from './api'
import type { Task, TaskRequest } from '../types/task'

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await apiService.get<Task[]>('/tasks')
    return response.data
  },

  async getById(id: string): Promise<Task> {
    const response = await apiService.get<Task>(`/tasks/${id}`)
    return response.data
  },

  async create(data: TaskRequest): Promise<Task> {
    const response = await apiService.post<Task>('/tasks', data)
    return response.data
  },

  async update(id: string, data: TaskRequest): Promise<Task> {
    const response = await apiService.put<Task>(`/tasks/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiService.delete(`/tasks/${id}`)
  },
}

