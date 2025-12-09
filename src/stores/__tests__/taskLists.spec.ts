import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskListStore } from '../taskLists'
import { taskListService } from '../../services/taskListService'
import type { TaskList, TaskListRequest, PageResponse } from '../../types/taskList'

vi.mock('../../services/taskListService')

describe('TaskListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockTaskList: TaskList = {
    id: '1',
    name: 'Test List',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  // Helper para criar uma cópia do mockTaskList com ID específico
  const createMockTaskList = (id: string = '1'): TaskList => ({
    ...mockTaskList,
    id,
  })

  const mockPageResponse: PageResponse<TaskList> = {
    content: [mockTaskList],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
  }

  describe('fetchAll', () => {
    it('deve buscar listas com paginação', async () => {
      vi.mocked(taskListService.getAll).mockResolvedValue(mockPageResponse)

      const store = useTaskListStore()
      await store.fetchAll(0, 10)

      expect(store.taskLists).toEqual([mockTaskList])
      expect(store.pagination).toEqual(mockPageResponse)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('deve tratar erros corretamente', async () => {
      const error = { response: { data: { message: 'Erro ao carregar' } } }
      vi.mocked(taskListService.getAll).mockRejectedValue(error)

      const store = useTaskListStore()

      await expect(store.fetchAll()).rejects.toEqual(error)
      expect(store.error).toBe('Erro ao carregar')
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchAllWithoutPagination', () => {
    it('deve buscar todas as listas sem paginação', async () => {
      const lists: TaskList[] = [mockTaskList]
      vi.mocked(taskListService.getAllWithoutPagination).mockResolvedValue(lists)

      const store = useTaskListStore()
      await store.fetchAllWithoutPagination()

      expect(store.taskLists).toEqual(lists)
      expect(store.pagination).toBeNull()
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchById', () => {
    it('deve buscar lista por ID', async () => {
      vi.mocked(taskListService.getById).mockResolvedValue(mockTaskList)

      const store = useTaskListStore()
      const result = await store.fetchById('1')

      expect(result).toEqual(mockTaskList)
      expect(store.loading).toBe(false)
    })
  })

  describe('create', () => {
    it('deve criar nova lista', async () => {
      const newList: TaskListRequest = {
        name: 'New List',
      }

      vi.mocked(taskListService.create).mockResolvedValue(mockTaskList)

      const store = useTaskListStore()
      const result = await store.create(newList)

      expect(result).toEqual(mockTaskList)
      expect(store.taskLists.length).toBe(1)
      expect(store.taskLists[0]).toEqual(mockTaskList)
      expect(store.loading).toBe(false)
    })
  })

  describe('update', () => {
    it('deve atualizar lista existente', async () => {
      const listId = '1'
      const updatedList: TaskList = { 
        id: listId,
        name: 'Updated List',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updateData: TaskListRequest = { name: 'Updated List' }

      vi.mocked(taskListService.update).mockResolvedValue(updatedList)

      const store = useTaskListStore()
      const result = await store.update(listId, updateData)

      // Verificar que o serviço foi chamado corretamente
      expect(taskListService.update).toHaveBeenCalledWith(listId, updateData)
      // Verificar que o resultado foi retornado
      expect(result).toEqual(updatedList)
      // Verificar que o loading foi desativado
      expect(store.loading).toBe(false)
    })
  })

  describe('remove', () => {
    it('deve remover lista', async () => {
      vi.mocked(taskListService.delete).mockResolvedValue(undefined)

      const store = useTaskListStore()
      store.taskLists.value = [mockTaskList]
      await store.remove('1')

      expect(store.taskLists).not.toContain(mockTaskList)
      expect(store.loading).toBe(false)
    })
  })

  describe('clearError', () => {
    it('deve limpar erro', () => {
      const store = useTaskListStore()
      store.error = 'Erro teste'

      store.clearError()

      expect(store.error).toBeNull()
    })
  })
})

