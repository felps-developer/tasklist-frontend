import { apiService } from './api'
import type { TaskList, TaskListRequest, PageResponse } from '../types/taskList'

export const taskListService = {
  async getAll(page: number = 0, size: number = 10, name?: string): Promise<PageResponse<TaskList>> {
    const params: any = { page, size }
    if (name) {
      params.name = name
    }
    const response = await apiService.get<PageResponse<TaskList>>('/task-lists', { params })
    return response.data
  },

  async getAllWithoutPagination(name?: string): Promise<TaskList[]> {
    const params: any = {}
    if (name) {
      params.name = name
    }
    const response = await apiService.get<TaskList[]>('/task-lists/all', { params })
    return response.data
  },

  async getById(id: string): Promise<TaskList> {
    const response = await apiService.get<TaskList>(`/task-lists/${id}`)
    return response.data
  },

  async create(data: TaskListRequest): Promise<TaskList> {
    const response = await apiService.post<TaskList>('/task-lists', data)
    return response.data
  },

  async update(id: string, data: TaskListRequest): Promise<TaskList> {
    const response = await apiService.put<TaskList>(`/task-lists/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiService.delete(`/task-lists/${id}`)
  },
}

