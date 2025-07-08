"use client"

import { useState } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Plus,
  FileText,
  Edit2,
  Save,
  X,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Project, Deliverable } from "../types/project-atlas"

interface ProjectRoadmapProps {
  project: Project
  onBack: () => void
  onUpdate: (project: Project) => void
}

export function ProjectRoadmap({ project, onBack, onUpdate }: ProjectRoadmapProps) {
  const [expandedPhases, setExpandedPhases] = useState<string[]>([project.roadmap[0]?.id || ""])
  const [editingDeliverable, setEditingDeliverable] = useState<{ phaseId: string; deliverable: Deliverable } | null>(
    null,
  )
  const [editingPhase, setEditingPhase] = useState<{ id: string; title: string; description: string } | null>(null)
  const [editingTodo, setEditingTodo] = useState<{ phaseId: string; todoId: string; text: string } | null>(null)
  const [newLink, setNewLink] = useState("")
  const [newTodo, setNewTodo] = useState("")
  const [newDeliverable, setNewDeliverable] = useState("")
  const [newPhase, setNewPhase] = useState({ title: "", description: "" })
  const [showAddPhase, setShowAddPhase] = useState(false)

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => (prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]))
  }

  const toggleTodo = (phaseId: string, todoId: string) => {
    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        const updatedTodos = phase.todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
        )
        const completedCount = updatedTodos.filter((t) => t.completed).length
        const progress = Math.round((completedCount / updatedTodos.length) * 100)

        return {
          ...phase,
          todos: updatedTodos,
          progress,
          status:
            progress === 100 ? ("completed" as const) : progress > 0 ? ("in-progress" as const) : ("pending" as const),
        }
      }
      return phase
    })

    const overallProgress = Math.round(
      updatedRoadmap.reduce((acc, phase) => acc + phase.progress, 0) / updatedRoadmap.length,
    )

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      overallProgress,
      updatedAt: new Date().toISOString(),
    })
  }

  const updatePhase = (phaseId: string, updates: { title?: string; description?: string; status?: string }) => {
    const updatedRoadmap = project.roadmap.map((phase) => (phase.id === phaseId ? { ...phase, ...updates } : phase))

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })
  }

  const addTodo = (phaseId: string) => {
    if (!newTodo.trim()) return

    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        const newTodoItem = {
          id: Date.now().toString(),
          text: newTodo.trim(),
          completed: false,
          priority: "medium" as const,
        }
        return {
          ...phase,
          todos: [...phase.todos, newTodoItem],
        }
      }
      return phase
    })

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })
    setNewTodo("")
  }

  const updateTodo = (phaseId: string, todoId: string, text: string) => {
    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          todos: phase.todos.map((todo) => (todo.id === todoId ? { ...todo, text } : todo)),
        }
      }
      return phase
    })

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })
  }

  const deleteTodo = (phaseId: string, todoId: string) => {
    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        const updatedTodos = phase.todos.filter((todo) => todo.id !== todoId)
        const completedCount = updatedTodos.filter((t) => t.completed).length
        const progress = updatedTodos.length > 0 ? Math.round((completedCount / updatedTodos.length) * 100) : 0

        return {
          ...phase,
          todos: updatedTodos,
          progress,
          status:
            progress === 100 ? ("completed" as const) : progress > 0 ? ("in-progress" as const) : ("pending" as const),
        }
      }
      return phase
    })

    const overallProgress = Math.round(
      updatedRoadmap.reduce((acc, phase) => acc + phase.progress, 0) / updatedRoadmap.length,
    )

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      overallProgress,
      updatedAt: new Date().toISOString(),
    })
  }

  const addDeliverable = (phaseId: string) => {
    if (!newDeliverable.trim()) return

    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        const newDeliverableItem = {
          id: Date.now().toString(),
          title: newDeliverable.trim(),
          notes: "",
          links: [],
          files: [],
          status: "pending" as const,
        }
        return {
          ...phase,
          deliverables: [...phase.deliverables, newDeliverableItem],
        }
      }
      return phase
    })

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })
    setNewDeliverable("")
  }

  const updateDeliverable = (phaseId: string, deliverableId: string, updates: Partial<Deliverable>) => {
    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          deliverables: phase.deliverables.map((deliverable) =>
            deliverable.id === deliverableId ? { ...deliverable, ...updates } : deliverable,
          ),
        }
      }
      return phase
    })

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })
  }

  const deleteDeliverable = (phaseId: string, deliverableId: string) => {
    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          deliverables: phase.deliverables.filter((deliverable) => deliverable.id !== deliverableId),
        }
      }
      return phase
    })

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })
  }

  const addLinkToDeliverable = (phaseId: string, deliverableId: string, link: string) => {
    if (!link.trim()) return

    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          deliverables: phase.deliverables.map((deliverable) =>
            deliverable.id === deliverableId
              ? { ...deliverable, links: [...deliverable.links, link.trim()] }
              : deliverable,
          ),
        }
      }
      return phase
    })

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })
  }

  const removeLink = (phaseId: string, deliverableId: string, linkIndex: number) => {
    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          deliverables: phase.deliverables.map((deliverable) =>
            deliverable.id === deliverableId
              ? { ...deliverable, links: deliverable.links.filter((_, index) => index !== linkIndex) }
              : deliverable,
          ),
        }
      }
      return phase
    })

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })
  }

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "pending":
        return "bg-slate-100 text-slate-700 border-slate-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      case "in-progress":
        return (
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )
      default:
        return <Circle className="w-5 h-5 text-slate-400" />
    }
  }

  const addPhase = () => {
    if (!newPhase.title.trim()) return

    const newPhaseItem = {
      id: Date.now().toString(),
      title: newPhase.title.trim(),
      description: newPhase.description.trim(),
      status: "pending" as const,
      progress: 0,
      estimatedDuration: 7,
      todos: [],
      deliverables: [],
    }

    const updatedRoadmap = [...project.roadmap, newPhaseItem]

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    })

    setNewPhase({ title: "", description: "" })
    setShowAddPhase(false)
  }

  const deletePhase = (phaseId: string) => {
    const updatedRoadmap = project.roadmap.filter((phase) => phase.id !== phaseId)

    const overallProgress =
      updatedRoadmap.length > 0
        ? Math.round(updatedRoadmap.reduce((acc, phase) => acc + phase.progress, 0) / updatedRoadmap.length)
        : 0

    onUpdate({
      ...project,
      roadmap: updatedRoadmap,
      overallProgress,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 p-2 hover:bg-white/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-6">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.name}
                className="w-16 h-16 rounded-lg object-cover shadow-sm"
              />
              <div>
                <h1 className="text-4xl font-light text-slate-900 mb-2">{project.name}</h1>
                <p className="text-slate-600">{project.details}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light text-slate-900 mb-1">{project.overallProgress}%</div>
            <div className="text-sm text-slate-600">Overall Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={project.overallProgress} className="h-3" />
        </div>

        {/* Roadmap */}
        <div className="space-y-6">
          {project.roadmap.map((phase, index) => (
            <Card key={phase.id} className="border-0 shadow-lg bg-white/80 backdrop-blur overflow-hidden">
              <CardHeader className="cursor-pointer hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4" onClick={() => togglePhase(phase.id)}>
                    {getPhaseIcon(phase.status)}
                    <div>
                      <CardTitle className="text-xl font-medium text-slate-900 flex items-center">
                        {editingPhase?.id === phase.id ? (
                          <Input
                            value={editingPhase.title}
                            onChange={(e) => setEditingPhase({ ...editingPhase, title: e.target.value })}
                            className="text-xl font-medium"
                            onBlur={() => {
                              updatePhase(phase.id, {
                                title: editingPhase.title,
                                description: editingPhase.description,
                              })
                              setEditingPhase(null)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updatePhase(phase.id, {
                                  title: editingPhase.title,
                                  description: editingPhase.description,
                                })
                                setEditingPhase(null)
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <>
                            Phase {index + 1}: {phase.title}
                            {expandedPhases.includes(phase.id) ? (
                              <ChevronDown className="w-5 h-5 ml-2 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 ml-2 text-slate-400" />
                            )}
                          </>
                        )}
                      </CardTitle>
                      {editingPhase?.id === phase.id ? (
                        <Textarea
                          value={editingPhase.description}
                          onChange={(e) => setEditingPhase({ ...editingPhase, description: e.target.value })}
                          className="mt-1"
                          onBlur={() => {
                            updatePhase(phase.id, { title: editingPhase.title, description: editingPhase.description })
                            setEditingPhase(null)
                          }}
                        />
                      ) : (
                        <p className="text-slate-600 mt-1">{phase.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingPhase({ id: phase.id, title: phase.title, description: phase.description })
                      }
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePhase(phase.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="text-right">
                      <div className="text-lg font-medium text-slate-900">{phase.progress}%</div>
                      <div className="text-sm text-slate-600">Complete</div>
                    </div>
                    <Select
                      value={phase.status}
                      onValueChange={(value) => {
                        updatePhase(phase.id, { status: value })
                        // Force re-render by updating the project
                        const updatedRoadmap = project.roadmap.map((p) =>
                          p.id === phase.id ? { ...p, status: value as any } : p,
                        )
                        onUpdate({
                          ...project,
                          roadmap: updatedRoadmap,
                          updatedAt: new Date().toISOString(),
                        })
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              {expandedPhases.includes(phase.id) && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Things to Do */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-slate-900">✅ Things to Do</h3>
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Add new task..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            className="w-48"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addTodo(phase.id)
                              }
                            }}
                          />
                          <Button size="sm" onClick={() => addTodo(phase.id)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {phase.todos.map((todo) => (
                          <div key={todo.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg group">
                            <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(phase.id, todo.id)} />
                            {editingTodo?.todoId === todo.id ? (
                              <Input
                                value={editingTodo.text}
                                onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
                                className="flex-1"
                                onBlur={() => {
                                  updateTodo(phase.id, todo.id, editingTodo.text)
                                  setEditingTodo(null)
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateTodo(phase.id, todo.id, editingTodo.text)
                                    setEditingTodo(null)
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              <span
                                className={`flex-1 cursor-pointer ${todo.completed ? "line-through text-slate-500" : "text-slate-900"}`}
                                onClick={() => setEditingTodo({ phaseId: phase.id, todoId: todo.id, text: todo.text })}
                              >
                                {todo.text}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTodo(phase.id, todo.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-slate-900">📦 Deliverables</h3>
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Add deliverable..."
                            value={newDeliverable}
                            onChange={(e) => setNewDeliverable(e.target.value)}
                            className="w-48"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addDeliverable(phase.id)
                              }
                            }}
                          />
                          <Button size="sm" onClick={() => addDeliverable(phase.id)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {phase.deliverables.map((deliverable) => (
                          <Card key={deliverable.id} className="border border-slate-200 group">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-medium text-slate-900">
                                  {deliverable.title}
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                  <Select
                                    value={deliverable.status}
                                    onValueChange={(value) =>
                                      updateDeliverable(phase.id, deliverable.id, {
                                        status: value as Deliverable["status"],
                                      })
                                    }
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingDeliverable({ phaseId: phase.id, deliverable })}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteDeliverable(phase.id, deliverable.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-3">
                              {/* Notes */}
                              {deliverable.notes && (
                                <div>
                                  <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                    Notes
                                  </Label>
                                  <p className="text-sm text-slate-700 mt-1">{deliverable.notes}</p>
                                </div>
                              )}

                              {/* Links */}
                              {deliverable.links.length > 0 && (
                                <div>
                                  <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                    Links
                                  </Label>
                                  <div className="space-y-1 mt-1">
                                    {deliverable.links.map((link, linkIndex) => (
                                      <div
                                        key={linkIndex}
                                        className="flex items-center justify-between bg-slate-50 p-2 rounded"
                                      >
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:text-blue-800 truncate flex-1"
                                        >
                                          {link}
                                        </a>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeLink(phase.id, deliverable.id, linkIndex)}
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Files */}
                              {deliverable.files.length > 0 && (
                                <div>
                                  <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                    Files
                                  </Label>
                                  <div className="space-y-1 mt-1">
                                    {deliverable.files.map((file, fileIndex) => (
                                      <div
                                        key={fileIndex}
                                        className="flex items-center space-x-2 bg-slate-50 p-2 rounded"
                                      >
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slate-700">{file}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Add Phase Button */}
        <Card className="border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur hover:border-blue-300 transition-colors">
          <CardContent className="p-8 text-center">
            {showAddPhase ? (
              <div className="space-y-4">
                <Input
                  placeholder="Phase title..."
                  value={newPhase.title}
                  onChange={(e) => setNewPhase((prev) => ({ ...prev, title: e.target.value }))}
                  className="text-center"
                />
                <Textarea
                  placeholder="Phase description..."
                  value={newPhase.description}
                  onChange={(e) => setNewPhase((prev) => ({ ...prev, description: e.target.value }))}
                  className="text-center"
                />
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" onClick={() => setShowAddPhase(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addPhase}>Add Phase</Button>
                </div>
              </div>
            ) : (
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setShowAddPhase(true)}
                  className="text-slate-600 hover:text-blue-600"
                >
                  <Plus className="w-6 h-6 mr-2" />
                  Add New Phase
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Deliverable Dialog */}
        <Dialog open={!!editingDeliverable} onOpenChange={(open) => !open && setEditingDeliverable(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Deliverable</DialogTitle>
            </DialogHeader>
            {editingDeliverable && (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="deliverable-title">Title</Label>
                  <Input
                    id="deliverable-title"
                    value={editingDeliverable.deliverable.title}
                    onChange={(e) =>
                      setEditingDeliverable((prev) =>
                        prev
                          ? {
                              ...prev,
                              deliverable: { ...prev.deliverable, title: e.target.value },
                            }
                          : null,
                      )
                    }
                    className="mt-1"
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="deliverable-notes">Notes</Label>
                  <Textarea
                    id="deliverable-notes"
                    value={editingDeliverable.deliverable.notes}
                    onChange={(e) =>
                      setEditingDeliverable((prev) =>
                        prev
                          ? {
                              ...prev,
                              deliverable: { ...prev.deliverable, notes: e.target.value },
                            }
                          : null,
                      )
                    }
                    placeholder="Add notes about this deliverable..."
                    className="mt-1"
                  />
                </div>

                {/* Add Link */}
                <div>
                  <Label htmlFor="new-link">Add Link</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="new-link"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="https://..."
                    />
                    <Button
                      onClick={() => {
                        if (newLink.trim()) {
                          addLinkToDeliverable(editingDeliverable.phaseId, editingDeliverable.deliverable.id, newLink)
                          setNewLink("")
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Current Links */}
                {editingDeliverable.deliverable.links.length > 0 && (
                  <div>
                    <Label>Current Links</Label>
                    <div className="space-y-2 mt-1">
                      {editingDeliverable.deliverable.links.map((link, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                          <span className="text-sm truncate flex-1">{link}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeLink(editingDeliverable.phaseId, editingDeliverable.deliverable.id, index)
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingDeliverable(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      updateDeliverable(editingDeliverable.phaseId, editingDeliverable.deliverable.id, {
                        title: editingDeliverable.deliverable.title,
                        notes: editingDeliverable.deliverable.notes,
                      })
                      setEditingDeliverable(null)
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
