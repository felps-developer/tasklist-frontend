export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface TaskRequest {
  title: string
  description?: string
  completed?: boolean
}

