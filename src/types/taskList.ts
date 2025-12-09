export interface TaskList {
  id: string
  name: string
  active: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface TaskListRequest {
  name: string
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

