import { describe, it, expect, beforeEach, vi } from 'vitest'
import { taskService } from '../taskService'
import { apiService } from '../api'
import type { Task, TaskRequest, PageResponse } from '../../types/task'

vi.mock('../api')

describe('TaskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('getAll', () => {
    it('deve buscar tarefas com paginação', async () => {
      const mockPageResponse: PageResponse<Task> = {
        content: [mockTask],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      }

      vi.mocked(apiService.get).mockResolvedValue({ data: mockPageResponse } as any)

      const result = await taskService.getAll(0, 10)

      expect(apiService.get).toHaveBeenCalledWith('/tasks', {
        params: { page: 0, size: 10 },
      })
      expect(result).toEqual(mockPageResponse)
    })

    it('deve incluir taskListId nos params quando fornecido', async () => {
      const mockPageResponse: PageResponse<Task> = {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      }

      vi.mocked(apiService.get).mockResolvedValue({ data: mockPageResponse } as any)

      await taskService.getAll(0, 10, 'list-id-123')

      expect(apiService.get).toHaveBeenCalledWith('/tasks', {
        params: { page: 0, size: 10, taskListId: 'list-id-123' },
      })
    })

    it('deve incluir title nos params quando fornecido', async () => {
      const mockPageResponse: PageResponse<Task> = {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      }

      vi.mocked(apiService.get).mockResolvedValue({ data: mockPageResponse } as any)

      await taskService.getAll(0, 10, undefined, 'search term')

      expect(apiService.get).toHaveBeenCalledWith('/tasks', {
        params: { page: 0, size: 10, title: 'search term' },
      })
    })
  })

  describe('getAllWithoutPagination', () => {
    it('deve buscar todas as tarefas sem paginação', async () => {
      const tasks: Task[] = [mockTask]

      vi.mocked(apiService.get).mockResolvedValue({ data: tasks } as any)

      const result = await taskService.getAllWithoutPagination()

      expect(apiService.get).toHaveBeenCalledWith('/tasks/all', { params: {} })
      expect(result).toEqual(tasks)
    })
  })

  describe('getById', () => {
    it('deve buscar tarefa por ID', async () => {
      vi.mocked(apiService.get).mockResolvedValue({ data: mockTask } as any)

      const result = await taskService.getById('1')

      expect(apiService.get).toHaveBeenCalledWith('/tasks/1')
      expect(result).toEqual(mockTask)
    })

    it('deve lançar erro quando ID é inválido', async () => {
      await expect(taskService.getById('')).rejects.toThrow('ID da tarefa é obrigatório')
      await expect(taskService.getById('undefined')).rejects.toThrow('ID da tarefa é obrigatório')
    })
  })

  describe('create', () => {
    it('deve criar nova tarefa', async () => {
      const taskData: TaskRequest = {
        title: 'New Task',
        description: 'New Description',
      }

      vi.mocked(apiService.post).mockResolvedValue({ data: mockTask } as any)

      const result = await taskService.create(taskData)

      expect(apiService.post).toHaveBeenCalledWith('/tasks', taskData)
      expect(result).toEqual(mockTask)
    })
  })

  describe('update', () => {
    it('deve atualizar tarefa', async () => {
      const taskData: TaskRequest = {
        title: 'Updated Task',
      }

      const updatedTask: Task = { ...mockTask, title: 'Updated Task' }

      vi.mocked(apiService.put).mockResolvedValue({ data: updatedTask } as any)

      const result = await taskService.update('1', taskData)

      expect(apiService.put).toHaveBeenCalledWith('/tasks/1', taskData)
      expect(result).toEqual(updatedTask)
    })

    it('deve lançar erro quando ID é inválido', async () => {
      await expect(taskService.update('', { title: 'Test' })).rejects.toThrow(
        'ID da tarefa é obrigatório',
      )
    })
  })

  describe('delete', () => {
    it('deve excluir tarefa', async () => {
      vi.mocked(apiService.delete).mockResolvedValue(undefined as any)

      await taskService.delete('1')

      expect(apiService.delete).toHaveBeenCalledWith('/tasks/1/soft')
    })

    it('deve lançar erro quando ID é inválido', async () => {
      await expect(taskService.delete('')).rejects.toThrow('ID da tarefa é obrigatório')
    })
  })
})

