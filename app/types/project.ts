export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "completed" | "on-hold"
  priority: "low" | "medium" | "high" | "critical"
  startDate: string
  endDate: string
  progress: number
  phases: Phase[]
  team: TeamMember[]
  budget: number
  spent: number
  image?: string
  todos: Todo[]
}

export interface Phase {
  id: string
  name: string
  description: string
  status: "pending" | "in-progress" | "completed" | "blocked"
  startDate: string
  endDate: string
  progress: number
  deliverables: Deliverable[]
  dependencies: string[]
}

export interface Deliverable {
  id: string
  name: string
  description: string
  status: "pending" | "in-progress" | "completed" | "blocked"
  dueDate: string
  assignee: string
  priority: "low" | "medium" | "high" | "critical"
}

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar?: string
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
}
