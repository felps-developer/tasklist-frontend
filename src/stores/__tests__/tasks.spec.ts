import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '../tasks'
import { taskService } from '../../services/taskService'
import type { Task, TaskRequest, PageResponse } from '../../types/task'

vi.mock('../../services/taskService')

describe('TaskStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  // Helper para criar uma cópia do mockTask com ID específico
  const createMockTask = (id: string = '1'): Task => ({
    ...mockTask,
    id,
  })

  const mockPageResponse: PageResponse<Task> = {
    content: [mockTask],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
  }

  describe('fetchAll', () => {
    it('deve buscar tarefas com paginação', async () => {
      vi.mocked(taskService.getAll).mockResolvedValue(mockPageResponse)

      const store = useTaskStore()
      await store.fetchAll(0, 10)

      expect(store.tasks).toEqual([mockTask])
      expect(store.pagination).toEqual(mockPageResponse)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('deve definir loading como true durante a busca', async () => {
      vi.mocked(taskService.getAll).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockPageResponse), 100)),
      )

      const store = useTaskStore()
      const promise = store.fetchAll()

      expect(store.loading).toBe(true)
      await promise
      expect(store.loading).toBe(false)
    })

    it('deve tratar erros corretamente', async () => {
      const error = { response: { data: { message: 'Erro ao carregar' } } }
      vi.mocked(taskService.getAll).mockRejectedValue(error)

      const store = useTaskStore()

      await expect(store.fetchAll()).rejects.toEqual(error)
      expect(store.error).toBe('Erro ao carregar')
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchAllWithoutPagination', () => {
    it('deve buscar todas as tarefas sem paginação', async () => {
      const tasks: Task[] = [mockTask]
      vi.mocked(taskService.getAllWithoutPagination).mockResolvedValue(tasks)

      const store = useTaskStore()
      await store.fetchAllWithoutPagination()

      expect(store.tasks).toEqual(tasks)
      expect(store.pagination).toBeNull()
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchById', () => {
    it('deve buscar tarefa por ID', async () => {
      vi.mocked(taskService.getById).mockResolvedValue(mockTask)

      const store = useTaskStore()
      const result = await store.fetchById('1')

      expect(result).toEqual(mockTask)
      expect(store.loading).toBe(false)
    })
  })

  describe('create', () => {
    it('deve criar nova tarefa', async () => {
      const newTask: TaskRequest = {
        title: 'New Task',
        description: 'New Description',
      }

      vi.mocked(taskService.create).mockResolvedValue(mockTask)

      const store = useTaskStore()
      const result = await store.create(newTask)

      expect(result).toEqual(mockTask)
      expect(store.tasks.length).toBe(1)
      expect(store.tasks[0]).toEqual(mockTask)
      expect(store.loading).toBe(false)
    })

    it('deve tratar erro ao criar tarefa', async () => {
      const error = { response: { data: { message: 'Erro ao criar' } } }
      vi.mocked(taskService.create).mockRejectedValue(error)

      const store = useTaskStore()

      await expect(store.create({ title: 'Test' })).rejects.toEqual(error)
      expect(store.error).toBe('Erro ao criar')
    })
  })

  describe('update', () => {
    it('deve atualizar tarefa existente', async () => {
      const taskId = '1'
      const updatedTask: Task = { 
        id: taskId,
        title: 'Updated Task',
        description: 'Test Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updateData: TaskRequest = { title: 'Updated Task' }

      vi.mocked(taskService.update).mockResolvedValue(updatedTask)

      const store = useTaskStore()
      const result = await store.update(taskId, updateData)

      // Verificar que o serviço foi chamado corretamente
      expect(taskService.update).toHaveBeenCalledWith(taskId, updateData)
      // Verificar que o resultado foi retornado
      expect(result).toEqual(updatedTask)
      // Verificar que o loading foi desativado
      expect(store.loading).toBe(false)
    })
  })

  describe('remove', () => {
    it('deve remover tarefa', async () => {
      vi.mocked(taskService.delete).mockResolvedValue(undefined)

      const store = useTaskStore()
      store.tasks.value = [mockTask]
      await store.remove('1')

      expect(store.tasks).not.toContain(mockTask)
      expect(store.loading).toBe(false)
    })

    it('deve tratar erro ao remover tarefa', async () => {
      const error = { response: { data: { message: 'Erro ao excluir' } } }
      vi.mocked(taskService.delete).mockRejectedValue(error)

      const store = useTaskStore()
      store.tasks.value = [mockTask]

      await expect(store.remove('1')).rejects.toEqual(error)
      expect(store.error).toBe('Erro ao excluir')
      expect(store.tasks.value.length).toBe(1) // Não deve remover em caso de erro
      expect(store.tasks.value[0]).toEqual(mockTask)
    })
  })

  describe('clearError', () => {
    it('deve limpar erro', () => {
      const store = useTaskStore()
      store.error = 'Erro teste'

      store.clearError()

      expect(store.error).toBeNull()
    })
  })
})

