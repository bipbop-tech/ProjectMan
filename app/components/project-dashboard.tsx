"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Clock, Edit2, Check } from "lucide-react"
import { generalTodoService } from "../../lib/supabase"
import type { Project, GeneralTodo, Activity } from "../types/project"

interface ProjectDashboardProps {
  projects: Project[]
  generalTodos: GeneralTodo[]
  activities: Activity[]
  onSelectProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  onUpdateGeneralTodos: (todos: GeneralTodo[]) => void
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return "N/A"

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  } catch {
    return "N/A"
  }
}

const getStatusSymbol = (status: string) => {
  switch (status) {
    case "planning":
      return "○"
    case "active":
      return "→"
    case "hold":
      return "⏸"
    case "completed":
      return "✓"
    default:
      return "○"
  }
}

const getPrioritySymbol = (priority: string) => {
  switch (priority) {
    case "low":
      return "▼"
    case "medium":
      return "■"
    case "high":
      return "▲"
    default:
      return "■"
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "project_created":
      return "+"
    case "project_updated":
      return "~"
    case "phase_completed":
      return "✓"
    case "deliverable_completed":
      return "📦"
    case "todo_completed":
      return "☑"
    default:
      return "•"
  }
}

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function ProjectDashboard({
  projects = [],
  generalTodos = [],
  activities = [],
  onSelectProject,
  onDeleteProject,
  onUpdateGeneralTodos,
}: ProjectDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [newTodo, setNewTodo] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium")
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editingTodoText, setEditingTodoText] = useState("")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const addGeneralTodo = async () => {
    if (newTodo.trim()) {
      try {
        const todoData = {
          text: newTodo.trim(),
          completed: false,
          priority: newTodoPriority,
        }

        const createdTodo = await generalTodoService.create(todoData)
        const newTodoItem: GeneralTodo = {
          id: createdTodo.id,
          text: createdTodo.text,
          completed: createdTodo.completed,
          priority: createdTodo.priority as any,
          dueDate: createdTodo.due_date,
          projectId: createdTodo.project_id,
        }

        onUpdateGeneralTodos([newTodoItem, ...generalTodos])
        setNewTodo("")
      } catch (error) {
        console.error("Error adding todo:", error)
      }
    }
  }

  const toggleGeneralTodo = async (todoId: string) => {
    try {
      const todo = generalTodos.find((t) => t.id === todoId)
      if (todo) {
        await generalTodoService.update(todoId, { completed: !todo.completed })
        const updatedTodos = generalTodos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
        )
        onUpdateGeneralTodos(updatedTodos)
      }
    } catch (error) {
      console.error("Error toggling todo:", error)
    }
  }

  const deleteGeneralTodo = async (todoId: string) => {
    try {
      await generalTodoService.delete(todoId)
      const updatedTodos = generalTodos.filter((todo) => todo.id !== todoId)
      onUpdateGeneralTodos(updatedTodos)
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  const startEditingTodo = (todo: GeneralTodo) => {
    setEditingTodo(todo.id)
    setEditingTodoText(todo.text)
  }

  const saveEditingTodo = async () => {
    if (editingTodo && editingTodoText.trim()) {
      try {
        await generalTodoService.update(editingTodo, { text: editingTodoText.trim() })
        const updatedTodos = generalTodos.map((todo) =>
          todo.id === editingTodo ? { ...todo, text: editingTodoText.trim() } : todo,
        )
        onUpdateGeneralTodos(updatedTodos)
        setEditingTodo(null)
        setEditingTodoText("")
      } catch (error) {
        console.error("Error updating todo:", error)
      }
    }
  }

  const cancelEditingTodo = () => {
    setEditingTodo(null)
    setEditingTodoText("")
  }

  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "active").length
  const completedProjects = projects.filter((p) => p.status === "completed").length
  const averageProgress =
    totalProjects > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) : 0

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">PROJECT ATLAS</h1>
            <p className="text-gray-400">Terminal Management System v2.1.0</p>
          </div>
          <Button
            onClick={() => onSelectProject({} as Project)}
            className="bg-white text-black hover:bg-gray-200 font-mono"
          >
            <Plus className="w-4 h-4 mr-2" />
            NEW PROJECT
          </Button>
        </div>

        {/* Terminal-style status line */}
        <div className="bg-gray-900 border border-gray-700 p-3 font-mono text-sm">
          <span className="text-white">{">"}</span> STATUS: OPERATIONAL | PROJECTS: {totalProjects} | ACTIVE:{" "}
          {activeProjects} | COMPLETED: {completedProjects} | UPTIME: 99.9%
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-terminal text-center p-4">
          <div className="text-2xl font-bold terminal-text">{totalProjects}</div>
          <div className="text-sm text-muted-foreground">TOTAL PROJECTS</div>
        </div>
        <div className="card-terminal text-center p-4">
          <div className="text-2xl font-bold text-white">{activeProjects}</div>
          <div className="text-sm text-muted-foreground">ACTIVE</div>
        </div>
        <div className="card-terminal text-center p-4">
          <div className="text-2xl font-bold terminal-text">{completedProjects}</div>
          <div className="text-sm text-muted-foreground">COMPLETED</div>
        </div>
        <div className="card-terminal text-center p-4">
          <div className="text-2xl font-bold text-white">{averageProgress}%</div>
          <div className="text-sm text-muted-foreground">AVG PROGRESS</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black border-gray-700 text-white placeholder-gray-500 font-mono"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-black border-gray-700 text-white font-mono">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="hold">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-black border-gray-700 text-white font-mono">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-700">
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <div className="card-terminal p-6">
            <h2 className="text-xl font-bold terminal-text mb-4">PROJECT_LIST</h2>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-4">○</div>
                <div>NO PROJECTS FOUND</div>
                <div className="text-sm mt-2">CREATE YOUR FIRST PROJECT TO GET STARTED</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border border-border p-4 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {project.image && (
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.name}
                            className="w-12 h-12 object-cover border border-border"
                          />
                        )}
                        <div>
                          <h3 className="font-bold terminal-text text-lg">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`status-symbol status-${project.status}`}>
                          {getStatusSymbol(project.status)}
                        </span>
                        <span className={`status-symbol priority-${project.priority}`}>
                          {getPrioritySymbol(project.priority)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground">STATUS</div>
                        <div className={`text-sm font-mono status-${project.status}`}>
                          {project.status?.toUpperCase() || "UNKNOWN"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">PRIORITY</div>
                        <div className={`text-sm font-mono priority-${project.priority}`}>
                          {project.priority?.toUpperCase() || "UNKNOWN"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">START DATE</div>
                        <div className="text-sm font-mono">{formatDate(project.startDate)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">END DATE</div>
                        <div className="text-sm font-mono">{formatDate(project.endDate)}</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>PROGRESS</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="progress-retro h-2">
                        <div className="progress-fill h-full" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => onSelectProject(project)} className="btn-terminal flex-1">
                        VIEW PROJECT
                      </button>
                      <button onClick={() => onDeleteProject(project.id)} className="btn-terminal btn-terminal-danger">
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* General To-Do List */}
          <div className="card-terminal p-6">
            <h3 className="text-lg font-bold terminal-text mb-4">GENERAL_TODOS</h3>

            {/* Add Todo Form */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add new todo..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="input-terminal flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addGeneralTodo()}
                />
                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value as "low" | "medium" | "high")}
                  className="input-terminal"
                >
                  <option value="low">LOW</option>
                  <option value="medium">MED</option>
                  <option value="high">HIGH</option>
                </select>
              </div>
              <button onClick={addGeneralTodo} className="btn-terminal w-full">
                <Plus className="w-4 h-4 inline mr-2" />
                ADD TODO
              </button>
            </div>

            {/* Todo List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generalTodos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-3 p-2 border border-border">
                  <button
                    onClick={() => toggleGeneralTodo(todo.id)}
                    className={`checkbox-terminal ${todo.completed ? "checked" : ""}`}
                  >
                    {todo.completed ? "✓" : ""}
                  </button>
                  <div className="flex-1">
                    {editingTodo === todo.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTodoText}
                          onChange={(e) => setEditingTodoText(e.target.value)}
                          className="editable-text flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditingTodo()
                            if (e.key === "Escape") cancelEditingTodo()
                          }}
                          autoFocus
                        />
                        <button onClick={saveEditingTodo} className="text-green-400 hover:text-green-300">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={cancelEditingTodo} className="text-red-400 hover:text-red-300">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : "text-white"}`}
                        >
                          {todo.text}
                        </span>
                        <button
                          onClick={() => startEditingTodo(todo)}
                          className="text-muted-foreground hover:text-white"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs priority-${todo.priority}`}>
                        {getPrioritySymbol(todo.priority)} {todo.priority?.toUpperCase() || "UNKNOWN"}
                      </span>
                      {todo.dueDate && (
                        <span className="text-xs text-muted-foreground">{formatDate(todo.dueDate)}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteGeneralTodo(todo.id)} className="text-muted-foreground hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {generalTodos.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <div className="text-2xl mb-2">○</div>
                  <div className="text-sm">NO TODOS</div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-terminal p-6">
            <h3 className="text-lg font-bold terminal-text mb-4">RECENT_ACTIVITY</h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 border border-border">
                  <div className="w-6 h-6 border border-border flex items-center justify-center text-xs font-mono">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">{activity.message}</div>
                    <div className="text-xs text-muted-foreground font-mono">{formatTimestamp(activity.timestamp)}</div>
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <div className="text-2xl mb-2">○</div>
                  <div className="text-sm">NO ACTIVITY</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
