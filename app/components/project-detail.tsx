"use client"

import type React from "react"
import { useState } from "react"
import {
  X,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Upload,
  Link,
  FileText,
  ImageIcon,
  File,
  Check,
  Edit,
} from "lucide-react"
import type { Project, Phase, Deliverable, PhaseItem } from "../types/project"

interface ProjectDetailProps {
  project: Project
  onUpdateProject: (project: Project) => void
  onBack: () => void
}

export function ProjectDetail({ project, onUpdateProject, onBack }: ProjectDetailProps) {
  const [editingPhase, setEditingPhase] = useState<string | null>(null)
  const [editingDeliverable, setEditingDeliverable] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [newTodo, setNewTodo] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium")
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({})
  const [newDeliverableInputs, setNewDeliverableInputs] = useState<Record<string, string>>({})
  const [newPhaseInput, setNewPhaseInput] = useState("")
  const [editingTexts, setEditingTexts] = useState<Record<string, string>>({})

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

  const togglePhaseItem = (phaseId: string, itemId: string) => {
    const updatedProject = { ...project }
    const phase = updatedProject.phases.find((p) => p.id === phaseId)
    if (phase) {
      const item = phase.items.find((i) => i.id === itemId)
      if (item) {
        item.completed = !item.completed
        // Update phase progress
        const completedItems = phase.items.filter((i) => i.completed).length
        phase.progress = Math.round((completedItems / phase.items.length) * 100)

        // Update overall project progress
        const totalItems = updatedProject.phases.reduce((sum, p) => sum + p.items.length, 0)
        const completedTotalItems = updatedProject.phases.reduce(
          (sum, p) => sum + p.items.filter((i) => i.completed).length,
          0,
        )
        updatedProject.progress = totalItems > 0 ? Math.round((completedTotalItems / totalItems) * 100) : 0
      }
    }
    onUpdateProject(updatedProject)
  }

  const addPhase = () => {
    if (!newPhaseInput.trim()) return

    const updatedProject = { ...project }
    const newPhase: Phase = {
      id: `phase-${Date.now()}`,
      name: newPhaseInput.trim(),
      status: "planning",
      progress: 0,
      items: [],
      deliverables: [],
    }
    updatedProject.phases.push(newPhase)
    setNewPhaseInput("")
    onUpdateProject(updatedProject)
  }

  const addPhaseItem = (phaseId: string) => {
    const taskText = newTaskInputs[phaseId]?.trim()
    if (!taskText) return

    const updatedProject = { ...project }
    const phase = updatedProject.phases.find((p) => p.id === phaseId)
    if (phase) {
      const newItem: PhaseItem = {
        id: `item-${Date.now()}`,
        name: taskText,
        completed: false,
      }
      phase.items.push(newItem)
    }

    setNewTaskInputs({ ...newTaskInputs, [phaseId]: "" })
    onUpdateProject(updatedProject)
  }

  const addPhaseDeliverable = (phaseId: string) => {
    const deliverableText = newDeliverableInputs[phaseId]?.trim()
    if (!deliverableText) return

    const updatedProject = { ...project }
    const phase = updatedProject.phases.find((p) => p.id === phaseId)
    if (phase) {
      const newDeliverable: Deliverable = {
        id: `deliverable-${Date.now()}`,
        name: deliverableText,
        status: "pending",
        files: [],
        links: [],
      }
      phase.deliverables.push(newDeliverable)
    }

    setNewDeliverableInputs({ ...newDeliverableInputs, [phaseId]: "" })
    onUpdateProject(updatedProject)
  }

  const updateDeliverableStatus = (
    phaseId: string,
    deliverableId: string,
    status: "pending" | "in-progress" | "completed",
  ) => {
    const updatedProject = { ...project }
    const phase = updatedProject.phases.find((p) => p.id === phaseId)
    if (phase) {
      const deliverable = phase.deliverables.find((d) => d.id === deliverableId)
      if (deliverable) {
        deliverable.status = status
      }
    }
    onUpdateProject(updatedProject)
  }

  const updatePhaseStatus = (phaseId: string, status: "planning" | "active" | "hold" | "completed") => {
    const updatedProject = { ...project }
    const phase = updatedProject.phases.find((p) => p.id === phaseId)
    if (phase) {
      phase.status = status
    }
    onUpdateProject(updatedProject)
  }

  const updateProjectStatus = (status: "planning" | "active" | "hold" | "completed") => {
    const updatedProject = { ...project }
    updatedProject.status = status
    onUpdateProject(updatedProject)
  }

  const updateProjectPriority = (priority: "low" | "medium" | "high") => {
    const updatedProject = { ...project }
    updatedProject.priority = priority
    onUpdateProject(updatedProject)
  }

  const handleFileUpload = (phaseId: string, deliverableId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const updatedProject = { ...project }
      const phase = updatedProject.phases.find((p) => p.id === phaseId)
      if (phase) {
        const deliverable = phase.deliverables.find((d) => d.id === deliverableId)
        if (deliverable) {
          deliverable.files = deliverable.files || []
          deliverable.files.push({
            id: `file-${Date.now()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target?.result as string,
          })
        }
      }
      onUpdateProject(updatedProject)
    }
    reader.readAsDataURL(file)
  }

  const addLink = (phaseId: string, deliverableId: string, url: string, title: string) => {
    if (!url.trim()) return

    const updatedProject = { ...project }
    const phase = updatedProject.phases.find((p) => p.id === phaseId)
    if (phase) {
      const deliverable = phase.deliverables.find((d) => d.id === deliverableId)
      if (deliverable) {
        deliverable.links = deliverable.links || []
        deliverable.links.push({
          id: `link-${Date.now()}`,
          url: url.trim(),
          title: title.trim() || url.trim(),
        })
      }
    }
    onUpdateProject(updatedProject)
  }

  const removeFile = (phaseId: string, deliverableId: string, fileId: string) => {
    const updatedProject = { ...project }
    const phase = updatedProject.phases.find((p) => p.id === phaseId)
    if (phase) {
      const deliverable = phase.deliverables.find((d) => d.id === deliverableId)
      if (deliverable && deliverable.files) {
        deliverable.files = deliverable.files.filter((f) => f.id !== fileId)
      }
    }
    onUpdateProject(updatedProject)
  }

  const removeLink = (phaseId: string, deliverableId: string, linkId: string) => {
    const updatedProject = { ...project }
    const phase = updatedProject.phases.find((p) => p.id === phaseId)
    if (phase) {
      const deliverable = phase.deliverables.find((d) => d.id === deliverableId)
      if (deliverable && deliverable.links) {
        deliverable.links = deliverable.links.filter((l) => l.id !== linkId)
      }
    }
    onUpdateProject(updatedProject)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (type.includes("pdf")) return <FileText className="w-4 h-4" />
    if (type.includes("presentation") || type.includes("powerpoint")) return <File className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const formatDate = (date: Date | string): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      return dateObj.toLocaleDateString()
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

  const handleEdit = (id: string, text: string) => {
    setEditingTexts({ ...editingTexts, [id]: text })
  }

  const saveEdit = (id: string, type: string, phaseId?: string) => {
    const updatedProject = { ...project }
    const newText = editingTexts[id]?.trim()

    if (!newText) return

    if (type === "project") {
      updatedProject.name = newText
    } else if (type === "phase" && phaseId) {
      const phase = updatedProject.phases.find((p) => p.id === phaseId)
      if (phase) {
        phase.name = newText
      }
    } else if (type === "item" && phaseId) {
      const phase = updatedProject.phases.find((p) => p.id === phaseId)
      if (phase) {
        const item = phase.items.find((i) => i.id === id)
        if (item) {
          item.name = newText
        }
      }
    } else if (type === "deliverable" && phaseId) {
      const phase = updatedProject.phases.find((p) => p.id === phaseId)
      if (phase) {
        const deliverable = phase.deliverables.find((d) => d.id === id)
        if (deliverable) {
          deliverable.name = newText
        }
      }
    }

    setEditingTexts({})
    setEditingProject(null)
    setEditingPhase(null)
    setEditingItem(null)
    setEditingDeliverable(null)
    onUpdateProject(updatedProject)
  }

  const cancelEdit = () => {
    setEditingTexts({})
    setEditingProject(null)
    setEditingPhase(null)
    setEditingItem(null)
    setEditingDeliverable(null)
  }

  // Safe access with fallbacks
  const safeProject = {
    ...project,
    status: project?.status || "planning",
    priority: project?.priority || "medium",
    name: project?.name || "Untitled Project",
    description: project?.description || "No description",
    progress: project?.progress || 0,
    phases: project?.phases || [],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-terminal">
          ← BACK TO DASHBOARD
        </button>
        <div className="text-sm text-muted-foreground font-mono">PROJECT ID: {safeProject.id}</div>
      </div>

      {/* Project Info */}
      <div className="card-terminal p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">PROJECT NAME</label>
              {editingProject === safeProject.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingTexts[safeProject.id] || safeProject.name}
                    onChange={(e) => handleEdit(safeProject.id, e.target.value)}
                    className="input-terminal flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(safeProject.id, "project")
                      if (e.key === "Escape") cancelEdit()
                    }}
                    autoFocus
                  />
                  <button onClick={() => saveEdit(safeProject.id, "project")} className="btn-terminal px-2">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={cancelEdit} className="btn-terminal px-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold terminal-text">{safeProject.name}</div>
                  <button
                    onClick={() => {
                      setEditingProject(safeProject.id)
                      handleEdit(safeProject.id, safeProject.name)
                    }}
                    className="text-muted-foreground hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">DESCRIPTION</label>
              <div className="text-muted-foreground">{safeProject.description}</div>
            </div>
          </div>

          <div className="space-y-4">
            {safeProject.image && (
              <div>
                <label className="text-xs text-muted-foreground block mb-1">PROJECT IMAGE</label>
                <img
                  src={safeProject.image || "/placeholder.svg"}
                  alt={safeProject.name}
                  className="w-full h-32 object-cover border border-border"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">STATUS</label>
                <select
                  value={safeProject.status}
                  onChange={(e) => updateProjectStatus(e.target.value as any)}
                  className="input-terminal w-full"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="hold">Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">PRIORITY</label>
                <select
                  value={safeProject.priority}
                  onChange={(e) => updateProjectPriority(e.target.value as any)}
                  className="input-terminal w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">TIMELINE</label>
              <div className="text-sm">
                <div>START: {formatDate(safeProject.startDate)}</div>
                <div>END: {formatDate(safeProject.endDate)}</div>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">OVERALL PROGRESS</label>
              <div className="text-2xl font-bold terminal-text mb-2">{safeProject.progress}%</div>
              <div className="progress-retro h-3">
                <div className="progress-fill h-full" style={{ width: `${safeProject.progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Phase */}
      <div className="card-terminal p-6">
        <h3 className="text-lg font-bold terminal-text mb-4">ADD_NEW_PHASE</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter phase name..."
            value={newPhaseInput}
            onChange={(e) => setNewPhaseInput(e.target.value)}
            className="input-terminal flex-1"
            onKeyDown={(e) => e.key === "Enter" && addPhase()}
          />
          <button onClick={addPhase} className="btn-terminal">
            <Plus className="w-4 h-4 mr-2" />
            ADD PHASE
          </button>
        </div>
      </div>

      {/* Project Phases */}
      <div className="card-terminal p-6">
        <h2 className="text-xl font-bold terminal-text mb-4">PROJECT_PHASES</h2>
        <div className="space-y-6">
          {safeProject.phases.map((phase) => {
            const safePhase = {
              ...phase,
              status: phase?.status || "planning",
              name: phase?.name || "Untitled Phase",
              progress: phase?.progress || 0,
              items: phase?.items || [],
              deliverables: phase?.deliverables || [],
            }

            return (
              <div key={safePhase.id} className="border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  {editingPhase === safePhase.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTexts[safePhase.id] || safePhase.name}
                        onChange={(e) => handleEdit(safePhase.id, e.target.value)}
                        className="input-terminal flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(safePhase.id, "phase", safePhase.id)
                          if (e.key === "Escape") cancelEdit()
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(safePhase.id, "phase", safePhase.id)}
                        className="btn-terminal px-2"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEdit} className="btn-terminal px-2">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold terminal-text">{safePhase.name}</h3>
                      <button
                        onClick={() => {
                          setEditingPhase(safePhase.id)
                          handleEdit(safePhase.id, safePhase.name)
                        }}
                        className="text-muted-foreground hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <select
                      value={safePhase.status}
                      onChange={(e) => updatePhaseStatus(safePhase.id, e.target.value as any)}
                      className="input-terminal text-xs px-2 py-1"
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="hold">Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                    <span className="text-sm font-mono">{safePhase.progress}%</span>
                  </div>
                </div>

                <div className="progress-retro h-2 mb-4">
                  <div className="progress-fill h-full" style={{ width: `${safePhase.progress}%` }} />
                </div>

                {/* Phase Content - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Things to Do */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="checkbox-terminal">✓</div>
                      <span className="font-semibold">Things to Do</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {safePhase.items.map((item) => {
                        const safeItem = {
                          ...item,
                          name: item?.name || "Untitled Task",
                          completed: item?.completed || false,
                        }

                        return (
                          <div key={safeItem.id} className="flex items-center gap-3">
                            <button
                              onClick={() => togglePhaseItem(safePhase.id, safeItem.id)}
                              className={`checkbox-terminal ${safeItem.completed ? "bg-primary text-primary-foreground" : ""}`}
                            >
                              {safeItem.completed ? "✓" : ""}
                            </button>
                            {editingItem === safeItem.id ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={editingTexts[safeItem.id] || safeItem.name}
                                  onChange={(e) => handleEdit(safeItem.id, e.target.value)}
                                  className="input-terminal flex-1"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit(safeItem.id, "item", safePhase.id)
                                    if (e.key === "Escape") cancelEdit()
                                  }}
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveEdit(safeItem.id, "item", safePhase.id)}
                                  className="btn-terminal px-2"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={cancelEdit} className="btn-terminal px-2">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-1">
                                <span
                                  className={`text-sm ${safeItem.completed ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {safeItem.name}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingItem(safeItem.id)
                                    handleEdit(safeItem.id, safeItem.name)
                                  }}
                                  className="text-muted-foreground hover:text-white"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new task..."
                        value={newTaskInputs[safePhase.id] || ""}
                        onChange={(e) => setNewTaskInputs({ ...newTaskInputs, [safePhase.id]: e.target.value })}
                        className="input-terminal flex-1"
                        onKeyDown={(e) => e.key === "Enter" && addPhaseItem(safePhase.id)}
                      />
                      <button
                        onClick={() => addPhaseItem(safePhase.id)}
                        className="w-8 h-8 bg-foreground text-background flex items-center justify-center hover:bg-primary"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 border border-white flex items-center justify-center text-xs">📦</div>
                      <span className="font-semibold">Deliverables</span>
                    </div>

                    <div className="space-y-3 mb-4">
                      {safePhase.deliverables.map((deliverable) => {
                        const safeDeliverable = {
                          ...deliverable,
                          name: deliverable?.name || "Untitled Deliverable",
                          status: deliverable?.status || "pending",
                          files: deliverable?.files || [],
                          links: deliverable?.links || [],
                        }

                        return (
                          <div key={safeDeliverable.id} className="border border-border p-3">
                            <div className="flex items-center justify-between mb-2">
                              {editingDeliverable === safeDeliverable.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={editingTexts[safeDeliverable.id] || safeDeliverable.name}
                                    onChange={(e) => handleEdit(safeDeliverable.id, e.target.value)}
                                    className="input-terminal flex-1"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveEdit(safeDeliverable.id, "deliverable", safePhase.id)
                                      if (e.key === "Escape") cancelEdit()
                                    }}
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => saveEdit(safeDeliverable.id, "deliverable", safePhase.id)}
                                    className="btn-terminal px-2"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button onClick={cancelEdit} className="btn-terminal px-2">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{safeDeliverable.name}</span>
                                  <button
                                    onClick={() => {
                                      setEditingDeliverable(safeDeliverable.id)
                                      handleEdit(safeDeliverable.id, safeDeliverable.name)
                                    }}
                                    className="text-muted-foreground hover:text-white"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <select
                                  value={safeDeliverable.status}
                                  onChange={(e) =>
                                    updateDeliverableStatus(safePhase.id, safeDeliverable.id, e.target.value as any)
                                  }
                                  className="input-terminal text-xs px-2 py-1"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>
                            </div>

                            {/* Files */}
                            {safeDeliverable.files && safeDeliverable.files.length > 0 && (
                              <div className="mb-2">
                                <div className="text-xs text-muted-foreground mb-1">FILES:</div>
                                <div className="space-y-1">
                                  {safeDeliverable.files.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        {getFileIcon(file.type)}
                                        <span>{file.name}</span>
                                        <span className="text-muted-foreground">
                                          ({Math.round(file.size / 1024)}KB)
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => removeFile(safePhase.id, safeDeliverable.id, file.id)}
                                        className="text-muted-foreground hover:text-white"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Links */}
                            {safeDeliverable.links && safeDeliverable.links.length > 0 && (
                              <div className="mb-2">
                                <div className="text-xs text-muted-foreground mb-1">LINKS:</div>
                                <div className="space-y-1">
                                  {safeDeliverable.links.map((link) => (
                                    <div key={link.id} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <Link className="w-3 h-3" />
                                        <a
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-white hover:underline"
                                        >
                                          {link.title}
                                        </a>
                                      </div>
                                      <button
                                        onClick={() => removeLink(safePhase.id, safeDeliverable.id, link.id)}
                                        className="text-muted-foreground hover:text-white"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Upload Actions */}
                            <div className="flex gap-2 mt-2">
                              <label className="btn-terminal text-xs px-2 py-1 cursor-pointer">
                                <Upload className="w-3 h-3 inline mr-1" />
                                FILE
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(safePhase.id, safeDeliverable.id, e)}
                                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                                />
                              </label>
                              <button
                                onClick={() => {
                                  const url = prompt("Enter URL:")
                                  const title = prompt("Enter title (optional):")
                                  if (url) addLink(safePhase.id, safeDeliverable.id, url, title || "")
                                }}
                                className="btn-terminal text-xs px-2 py-1"
                              >
                                <Link className="w-3 h-3 inline mr-1" />
                                LINK
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add deliverable..."
                        value={newDeliverableInputs[safePhase.id] || ""}
                        onChange={(e) =>
                          setNewDeliverableInputs({ ...newDeliverableInputs, [safePhase.id]: e.target.value })
                        }
                        className="input-terminal flex-1"
                        onKeyDown={(e) => e.key === "Enter" && addPhaseDeliverable(safePhase.id)}
                      />
                      <button
                        onClick={() => addPhaseDeliverable(safePhase.id)}
                        className="w-8 h-8 bg-foreground text-background flex items-center justify-center hover:bg-primary"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
