export interface PhaseItem {
  id: string
  name: string
  completed: boolean
}

export interface DeliverableFile {
  id: string
  name: string
  type: string
  size: number
  data: string
}

export interface DeliverableLink {
  id: string
  url: string
  title: string
}

export interface Deliverable {
  id: string
  name: string
  status: "pending" | "in-progress" | "completed"
  files?: DeliverableFile[]
  links?: DeliverableLink[]
}

export interface Phase {
  id: string
  name: string
  status: "planning" | "active" | "hold" | "completed"
  progress: number
  items: PhaseItem[]
  deliverables: Deliverable[]
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
}

export interface GeneralTodo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  projectId?: string
}

export interface Activity {
  id: string
  type: "project_created" | "project_updated" | "phase_completed" | "deliverable_completed" | "todo_completed"
  message: string
  timestamp: Date
  projectId?: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "hold" | "completed"
  priority: "low" | "medium" | "high"
  progress: number
  startDate: Date | string
  endDate: Date | string
  image?: string
  phases: Phase[]
  deliverables: Deliverable[]
  todos: Todo[]
}
