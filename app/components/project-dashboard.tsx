"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Target, TrendingUp, Clock, Search, Filter, BarChart3, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Project } from "../types/project-atlas"
import { Checkbox } from "@/components/ui/checkbox"

interface ProjectDashboardProps {
  projects: Project[]
  onCreateProject: () => void
  onSelectProject: (project: Project) => void
  onAnalytics: () => void
  onUpdateProject: (project: Project) => void
}

export function ProjectDashboard({
  projects,
  onCreateProject,
  onSelectProject,
  onAnalytics,
  onUpdateProject,
}: ProjectDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [generalTodos, setGeneralTodos] = useState<Array<{ id: string; text: string; completed: boolean }>>([])
  const [newGeneralTodo, setNewGeneralTodo] = useState("")

  // Load general todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("project-atlas-general-todos")
    if (savedTodos) {
      setGeneralTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save general todos to localStorage
  useEffect(() => {
    if (generalTodos.length > 0) {
      localStorage.setItem("project-atlas-general-todos", JSON.stringify(generalTodos))
    }
  }, [generalTodos])

  const addGeneralTodo = () => {
    if (!newGeneralTodo.trim()) return
    const newTodo = {
      id: Date.now().toString(),
      text: newGeneralTodo.trim(),
      completed: false,
    }
    setGeneralTodos((prev) => [...prev, newTodo])
    setNewGeneralTodo("")
  }

  const toggleGeneralTodo = (todoId: string) => {
    setGeneralTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteGeneralTodo = (todoId: string) => {
    setGeneralTodos((prev) => prev.filter((todo) => todo.id !== todoId))
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "on-hold":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "archived":
        return "bg-slate-100 text-slate-700 border-slate-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getPriorityColor = (priority: Project["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const activeProjects = projects.filter((p) => p.status === "active")
  const completedProjects = projects.filter((p) => p.status === "completed")
  const avgProgress =
    projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.overallProgress, 0) / projects.length) : 0

  const handleUpdateProject = (updatedProject: Project) => {
    onUpdateProject(updatedProject)
    setEditingProject(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Project Atlas</h1>
                <p className="text-slate-600">AI-powered project management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={onAnalytics} variant="outline" className="border-slate-200 bg-transparent">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Projects</p>
                      <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active</p>
                      <p className="text-3xl font-bold text-slate-900">{activeProjects.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Completed</p>
                      <p className="text-3xl font-bold text-slate-900">{completedProjects.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Avg Progress</p>
                      <p className="text-3xl font-bold text-slate-900">{avgProgress}%</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-200 group"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1" onClick={() => onSelectProject(project)}>
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.name}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm cursor-pointer"
                          />
                          <div className="flex-1 cursor-pointer">
                            <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </CardTitle>
                            <p className="text-sm text-slate-600 mt-1">
                              Created {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingProject(project)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Badge className={`${getStatusColor(project.status)} text-xs font-medium`}>
                            {project.status.replace("-", " ")}
                          </Badge>
                          <Badge className={`${getPriorityColor(project.priority)} text-xs font-medium`}>
                            {project.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0" onClick={() => onSelectProject(project)}>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2 cursor-pointer">{project.details}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                          <span className="text-sm text-slate-600">{project.overallProgress}%</span>
                        </div>
                        <Progress value={project.overallProgress} className="h-2" />
                      </div>

                      {/* Phase Info */}
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          <span>
                            Phase {project.currentPhase + 1} of {project.roadmap.length}
                          </span>
                        </div>
                        <span>{project.roadmap.filter((p) => p.status === "completed").length} phases completed</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-light text-slate-900 mb-4">
                  {projects.length === 0 ? "No projects yet" : "No projects match your filters"}
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  {projects.length === 0
                    ? "Create your first project and let our AI generate a complete roadmap to guide you through every phase of development."
                    : "Try adjusting your search or filter criteria to find the projects you're looking for."}
                </p>
                {projects.length === 0 && (
                  <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* General To-Do List */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">General To-Do List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add new todo */}
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add a task..."
                      value={newGeneralTodo}
                      onChange={(e) => setNewGeneralTodo(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addGeneralTodo()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addGeneralTodo}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Todo list */}
                  <div className="space-y-2">
                    {generalTodos.map((todo) => (
                      <div key={todo.id} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg group">
                        <Checkbox checked={todo.completed} onCheckedChange={() => toggleGeneralTodo(todo.id)} />
                        <span
                          className={`flex-1 text-sm ${todo.completed ? "line-through text-slate-500" : "text-slate-900"}`}
                        >
                          {todo.text}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGeneralTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    {generalTodos.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">No tasks yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100"
                      onClick={() => onSelectProject(project)}
                    >
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{project.name}</p>
                        <p className="text-xs text-slate-600">
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Project Dialog */}
        <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            {editingProject && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Project Name</Label>
                    <Input
                      id="edit-name"
                      value={editingProject.name}
                      onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingProject.status}
                      onValueChange={(value) =>
                        setEditingProject({ ...editingProject, status: value as Project["status"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={editingProject.priority}
                      onValueChange={(value) =>
                        setEditingProject({ ...editingProject, priority: value as Project["priority"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-due-date">Due Date</Label>
                    <Input
                      id="edit-due-date"
                      type="date"
                      value={editingProject.dueDate}
                      onChange={(e) => setEditingProject({ ...editingProject, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-details">Project Details</Label>
                  <Textarea
                    id="edit-details"
                    value={editingProject.details}
                    onChange={(e) => setEditingProject({ ...editingProject, details: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-notes">General Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingProject.generalNotes}
                    onChange={(e) => setEditingProject({ ...editingProject, generalNotes: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingProject(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdateProject(editingProject)}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
