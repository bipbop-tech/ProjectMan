export interface SubTask {
  id: string
  text: string
  completed: boolean
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
}

export interface Deliverable {
  id: string
  title: string
  notes: string
  links: string[]
  files: string[]
  status: "pending" | "in-progress" | "completed"
}

export interface Phase {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  progress: number
  estimatedDuration: number // in days
  todos: Todo[]
  deliverables: Deliverable[]
  startDate?: string
  endDate?: string
}

export interface Project {
  id: string
  name: string
  details: string
  image: string
  generalNotes: string
  createdAt: string
  updatedAt: string
  status: "active" | "completed" | "on-hold" | "archived"
  currentPhase: number
  overallProgress: number
  roadmap: Phase[]
  tags: string[]
  priority: "low" | "medium" | "high"
  dueDate: string
  owner: User
  teamMembers: TeamMember[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "admin" | "user"
  createdAt: string
}

export interface TeamMember {
  id: string
  user: User
  role: "owner" | "admin" | "editor" | "viewer"
  joinedAt: string
}
