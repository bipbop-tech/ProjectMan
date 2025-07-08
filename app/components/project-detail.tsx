"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  X,
  Plus,
  Users,
  DollarSign,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Trash2,
} from "lucide-react"
import type { Project, Phase, Deliverable, Todo } from "../types/project"

interface ProjectDetailProps {
  project: Project
  onUpdateProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  onBack: () => void
}

export function ProjectDetail({ project, onUpdateProject, onDeleteProject, onBack }: ProjectDetailProps) {
  const [editingPhase, setEditingPhase] = useState<string | null>(null)
  const [editingDeliverable, setEditingDeliverable] = useState<string | null>(null)
  const [newTodo, setNewTodo] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-white" />
      case "in-progress":
        return <TrendingUp className="w-4 h-4 text-white" />
      case "blocked":
        return <AlertTriangle className="w-4 h-4 text-white" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-white text-black"
      case "in-progress":
        return "bg-gray-700 text-white border border-gray-500"
      case "blocked":
        return "bg-gray-800 text-white border border-gray-600"
      case "pending":
        return "bg-gray-900 text-gray-400 border border-gray-700"
      default:
        return "bg-gray-800 text-white border border-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-white text-black"
      case "high":
        return "bg-gray-700 text-white border border-gray-500"
      case "medium":
        return "bg-gray-800 text-gray-300 border border-gray-600"
      case "low":
        return "bg-gray-900 text-gray-500 border border-gray-700"
      default:
        return "bg-gray-800 text-white border border-gray-600"
    }
  }

  const updatePhaseStatus = (phaseId: string, status: Phase["status"]) => {
    const updatedProject = {
      ...project,
      phases: project.phases.map((phase) => (phase.id === phaseId ? { ...phase, status } : phase)),
    }
    onUpdateProject(updatedProject)
  }

  const updateDeliverableStatus = (phaseId: string, deliverableId: string, status: Deliverable["status"]) => {
    const updatedProject = {
      ...project,
      phases: project.phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              deliverables: phase.deliverables.map((deliverable) =>
                deliverable.id === deliverableId ? { ...deliverable, status } : deliverable,
              ),
            }
          : phase,
      ),
    }
    onUpdateProject(updatedProject)
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        priority: newTodoPriority,
      }
      const updatedProject = {
        ...project,
        todos: [...project.todos, todo],
      }
      onUpdateProject(updatedProject)
      setNewTodo("")
    }
  }

  const toggleTodo = (todoId: string) => {
    const updatedProject = {
      ...project,
      todos: project.todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)),
    }
    onUpdateProject(updatedProject)
  }

  const deleteTodo = (todoId: string) => {
    const updatedProject = {
      ...project,
      todos: project.todos.filter((todo) => todo.id !== todoId),
    }
    onUpdateProject(updatedProject)
  }

  // Calculate project statistics
  const totalDeliverables = project.phases.reduce((sum, phase) => sum + phase.deliverables.length, 0)
  const completedDeliverables = project.phases.reduce(
    (sum, phase) => sum + phase.deliverables.filter((d) => d.status === "completed").length,
    0,
  )
  const completedTodos = project.todos.filter((todo) => todo.completed).length
  const budgetUsed = (project.spent / project.budget) * 100

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-gray-400">{project.description}</p>
            </div>
          </div>
          <Button
            onClick={() => onDeleteProject(project.id)}
            className="bg-gray-800 text-white hover:bg-gray-700 font-mono"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            DELETE
          </Button>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-3 font-mono text-sm">
          <span className="text-white">{">"}</span> PROJECT: {project.name.toUpperCase()} | STATUS:{" "}
          {project.status.toUpperCase()} | PROGRESS: {project.progress}% | BUDGET: ${project.spent.toLocaleString()}/$
          {project.budget.toLocaleString()}
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">PROGRESS</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">{project.progress}%</div>
            <Progress value={project.progress} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">DELIVERABLES</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {completedDeliverables}/{totalDeliverables}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((completedDeliverables / totalDeliverables) * 100) || 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">BUDGET</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(budgetUsed)}%</div>
            <p className="text-xs text-gray-500 mt-1">${project.spent.toLocaleString()} spent</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">TEAM</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{project.team.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active members</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-700">
          <TabsTrigger value="phases" className="font-mono">
            PHASES
          </TabsTrigger>
          <TabsTrigger value="team" className="font-mono">
            TEAM
          </TabsTrigger>
          <TabsTrigger value="todos" className="font-mono">
            TODOS
          </TabsTrigger>
        </TabsList>

        {/* Phases Tab */}
        <TabsContent value="phases" className="space-y-6">
          {project.phases.map((phase) => (
            <Card key={phase.id} className="bg-black border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-white font-mono">{phase.name}</CardTitle>
                    <Badge className={`${getStatusColor(phase.status)} font-mono text-xs`}>
                      {getStatusIcon(phase.status)}
                      <span className="ml-1">{phase.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                  <Select
                    value={phase.status}
                    onValueChange={(value: Phase["status"]) => updatePhaseStatus(phase.id, value)}
                  >
                    <SelectTrigger className="w-40 bg-black border-gray-700 text-white font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700">
                      <SelectItem value="pending">PENDING</SelectItem>
                      <SelectItem value="in-progress">IN PROGRESS</SelectItem>
                      <SelectItem value="completed">COMPLETED</SelectItem>
                      <SelectItem value="blocked">BLOCKED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-gray-400 text-sm">{phase.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    {phase.startDate} → {phase.endDate}
                  </span>
                  <span>Progress: {phase.progress}%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-mono mb-3">DELIVERABLES</h4>
                    <div className="space-y-2">
                      {phase.deliverables.map((deliverable) => (
                        <div
                          key={deliverable.id}
                          className="flex items-center justify-between p-3 border border-gray-800 rounded"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-mono">{deliverable.name}</span>
                              <Badge className={`${getStatusColor(deliverable.status)} font-mono text-xs`}>
                                {deliverable.status.toUpperCase()}
                              </Badge>
                              <Badge className={`${getPriorityColor(deliverable.priority)} font-mono text-xs`}>
                                {deliverable.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm">{deliverable.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span>Due: {deliverable.dueDate}</span>
                              <span>Assignee: {deliverable.assignee}</span>
                            </div>
                          </div>
                          <Select
                            value={deliverable.status}
                            onValueChange={(value: Deliverable["status"]) =>
                              updateDeliverableStatus(phase.id, deliverable.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 bg-black border-gray-700 text-white font-mono">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-gray-700">
                              <SelectItem value="pending">PENDING</SelectItem>
                              <SelectItem value="in-progress">IN PROGRESS</SelectItem>
                              <SelectItem value="completed">COMPLETED</SelectItem>
                              <SelectItem value="blocked">BLOCKED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card className="bg-black border-gray-700">
            <CardHeader>
              <CardTitle className="text-white font-mono">TEAM MEMBERS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.team.map((member) => (
                  <div key={member.id} className="p-4 border border-gray-800 rounded">
                    <div className="text-white font-mono font-bold mb-1">{member.name}</div>
                    <div className="text-gray-400 text-sm mb-2">{member.role}</div>
                    <div className="text-gray-500 text-xs font-mono">{member.email}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Todos Tab */}
        <TabsContent value="todos" className="space-y-6">
          <Card className="bg-black border-gray-700">
            <CardHeader>
              <CardTitle className="text-white font-mono">PROJECT TODOS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Todo Form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add new todo..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="bg-black border-gray-700 text-white font-mono flex-1"
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                />
                <Select value={newTodoPriority} onValueChange={(value: any) => setNewTodoPriority(value)}>
                  <SelectTrigger className="w-32 bg-black border-gray-700 text-white font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-700">
                    <SelectItem value="low">LOW</SelectItem>
                    <SelectItem value="medium">MEDIUM</SelectItem>
                    <SelectItem value="high">HIGH</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addTodo} className="bg-white text-black hover:bg-gray-200 font-mono">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Todos List */}
              <div className="space-y-2">
                {project.todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-3 p-3 border border-gray-800 rounded">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="border-gray-600"
                    />
                    <div className="flex-1">
                      <span className={`font-mono ${todo.completed ? "line-through text-gray-500" : "text-white"}`}>
                        {todo.text}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getPriorityColor(todo.priority)} font-mono text-xs`}>
                          {todo.priority.toUpperCase()}
                        </Badge>
                        {todo.dueDate && <span className="text-gray-500 text-xs font-mono">Due: {todo.dueDate}</span>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {project.todos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="font-mono">NO TODOS FOUND</p>
                    <p className="text-sm">Add a todo to get started</p>
                  </div>
                )}
              </div>

              {/* Todo Statistics */}
              <div className="border-t border-gray-800 pt-4">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-gray-400">
                    COMPLETED: {completedTodos}/{project.todos.length}
                  </span>
                  <span className="text-gray-400">
                    PROGRESS: {project.todos.length > 0 ? Math.round((completedTodos / project.todos.length) * 100) : 0}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
