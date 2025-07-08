export interface Todo {
  id: string
  text: string
  completed: boolean
}

export interface Deliverable {
  id: string
  title: string
  notes: string
  links: string[]
  files: string[]
}

export interface Phase {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  progress: number
  todos: Todo[]
  deliverables: Deliverable[]
}

export interface Project {
  id: string
  name: string
  details: string
  image: string
  generalNotes: string
  createdAt: string
  status: "active" | "completed" | "on-hold"
  currentPhase: number
  overallProgress: number
  roadmap: Phase[]
}
