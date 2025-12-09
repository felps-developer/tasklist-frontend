import { describe, it, expect, beforeEach, vi } from 'vitest'
import { taskListService } from '../taskListService'
import { apiService } from '../api'
import type { TaskList, TaskListRequest, PageResponse } from '../../types/taskList'

vi.mock('../api')

describe('TaskListService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockTaskList: TaskList = {
    id: '1',
    name: 'Test List',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('getAll', () => {
    it('deve buscar listas com paginação', async () => {
      const mockPageResponse: PageResponse<TaskList> = {
        content: [mockTaskList],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      }

      vi.mocked(apiService.get).mockResolvedValue({ data: mockPageResponse } as any)

      const result = await taskListService.getAll(0, 10)

      expect(apiService.get).toHaveBeenCalledWith('/task-lists', {
        params: { page: 0, size: 10 },
      })
      expect(result).toEqual(mockPageResponse)
    })

    it('deve incluir name nos params quando fornecido', async () => {
      const mockPageResponse: PageResponse<TaskList> = {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      }

      vi.mocked(apiService.get).mockResolvedValue({ data: mockPageResponse } as any)

      await taskListService.getAll(0, 10, 'search term')

      expect(apiService.get).toHaveBeenCalledWith('/task-lists', {
        params: { page: 0, size: 10, name: 'search term' },
      })
    })
  })

  describe('getAllWithoutPagination', () => {
    it('deve buscar todas as listas sem paginação', async () => {
      const lists: TaskList[] = [mockTaskList]

      vi.mocked(apiService.get).mockResolvedValue({ data: lists } as any)

      const result = await taskListService.getAllWithoutPagination()

      expect(apiService.get).toHaveBeenCalledWith('/task-lists/all', { params: {} })
      expect(result).toEqual(lists)
    })
  })

  describe('getById', () => {
    it('deve buscar lista por ID', async () => {
      vi.mocked(apiService.get).mockResolvedValue({ data: mockTaskList } as any)

      const result = await taskListService.getById('1')

      expect(apiService.get).toHaveBeenCalledWith('/task-lists/1')
      expect(result).toEqual(mockTaskList)
    })
  })

  describe('create', () => {
    it('deve criar nova lista', async () => {
      const listData: TaskListRequest = {
        name: 'New List',
      }

      vi.mocked(apiService.post).mockResolvedValue({ data: mockTaskList } as any)

      const result = await taskListService.create(listData)

      expect(apiService.post).toHaveBeenCalledWith('/task-lists', listData)
      expect(result).toEqual(mockTaskList)
    })
  })

  describe('update', () => {
    it('deve atualizar lista', async () => {
      const listData: TaskListRequest = {
        name: 'Updated List',
      }

      const updatedList: TaskList = { ...mockTaskList, name: 'Updated List' }

      vi.mocked(apiService.put).mockResolvedValue({ data: updatedList } as any)

      const result = await taskListService.update('1', listData)

      expect(apiService.put).toHaveBeenCalledWith('/task-lists/1', listData)
      expect(result).toEqual(updatedList)
    })
  })

  describe('delete', () => {
    it('deve excluir lista', async () => {
      vi.mocked(apiService.delete).mockResolvedValue(undefined as any)

      await taskListService.delete('1')

      expect(apiService.delete).toHaveBeenCalledWith('/task-lists/1')
    })
  })
})

