export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  active: boolean
  taskListId?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface TaskRequest {
  title: string
  description?: string
  completed?: boolean
  taskListId?: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

