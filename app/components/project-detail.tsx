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
  const [newTodo, setNewTodo] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium")
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({})
  const [newDeliverableInputs, setNewDeliverableInputs] = useState<Record<string, string>>({})
  const [newPhaseInput, setNewPhaseInput] = useState("")

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-terminal">
          ← BACK TO DASHBOARD
        </button>
        <div className="text-sm text-muted-foreground font-mono">PROJECT ID: {project.id}</div>
      </div>

      {/* Project Info */}
      <div className="card-terminal p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">PROJECT NAME</label>
              <div className="text-xl font-bold terminal-text">{project.name}</div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">DESCRIPTION</label>
              <div className="text-muted-foreground">{project.description}</div>
            </div>
          </div>

          <div className="space-y-4">
            {project.image && (
              <div>
                <label className="text-xs text-muted-foreground block mb-1">PROJECT IMAGE</label>
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  className="w-full h-32 object-cover border border-border"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">STATUS</label>
                <div className={`status-${project.status} flex items-center gap-2`}>
                  <span>{getStatusSymbol(project.status)}</span>
                  <span>{project.status.toUpperCase()}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">PRIORITY</label>
                <div className={`priority-${project.priority}`}>{project.priority.toUpperCase()}</div>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">TIMELINE</label>
              <div className="text-sm">
                <div>START: {formatDate(project.startDate)}</div>
                <div>END: {formatDate(project.endDate)}</div>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">OVERALL PROGRESS</label>
              <div className="text-2xl font-bold terminal-text mb-2">{project.progress}%</div>
              <div className="progress-retro h-3">
                <div className="progress-fill h-full" style={{ width: `${project.progress}%` }} />
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
          {project.phases.map((phase) => (
            <div key={phase.id} className="border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold terminal-text">{phase.name}</h3>
                <div className="flex items-center gap-4">
                  <span className={`status-symbol status-${phase.status}`}>{getStatusSymbol(phase.status)}</span>
                  <span className="text-sm font-mono">{phase.progress}%</span>
                </div>
              </div>

              <div className="progress-retro h-2 mb-4">
                <div className="progress-fill h-full" style={{ width: `${phase.progress}%` }} />
              </div>

              {/* Phase Content - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Things to Do */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-white text-black flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="font-semibold">Things to Do</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {phase.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <button
                          onClick={() => togglePhaseItem(phase.id, item.id)}
                          className={`w-4 h-4 border border-border flex items-center justify-center text-xs ${
                            item.completed ? "bg-primary text-primary-foreground" : ""
                          }`}
                        >
                          {item.completed ? "✓" : ""}
                        </button>
                        <span className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new task..."
                      value={newTaskInputs[phase.id] || ""}
                      onChange={(e) => setNewTaskInputs({ ...newTaskInputs, [phase.id]: e.target.value })}
                      className="input-terminal flex-1"
                      onKeyDown={(e) => e.key === "Enter" && addPhaseItem(phase.id)}
                    />
                    <button
                      onClick={() => addPhaseItem(phase.id)}
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
                    {phase.deliverables.map((deliverable) => (
                      <div key={deliverable.id} className="border border-border p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{deliverable.name}</span>
                          <div className="flex items-center gap-2">
                            <select
                              value={deliverable.status}
                              onChange={(e) => updateDeliverableStatus(phase.id, deliverable.id, e.target.value as any)}
                              className="input-terminal text-xs px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>

                        {/* Files */}
                        {deliverable.files && deliverable.files.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs text-muted-foreground mb-1">FILES:</div>
                            <div className="space-y-1">
                              {deliverable.files.map((file) => (
                                <div key={file.id} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    {getFileIcon(file.type)}
                                    <span>{file.name}</span>
                                    <span className="text-muted-foreground">({Math.round(file.size / 1024)}KB)</span>
                                  </div>
                                  <button
                                    onClick={() => removeFile(phase.id, deliverable.id, file.id)}
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
                        {deliverable.links && deliverable.links.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs text-muted-foreground mb-1">LINKS:</div>
                            <div className="space-y-1">
                              {deliverable.links.map((link) => (
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
                                    onClick={() => removeLink(phase.id, deliverable.id, link.id)}
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
                              onChange={(e) => handleFileUpload(phase.id, deliverable.id, e)}
                              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                            />
                          </label>
                          <button
                            onClick={() => {
                              const url = prompt("Enter URL:")
                              const title = prompt("Enter title (optional):")
                              if (url) addLink(phase.id, deliverable.id, url, title || "")
                            }}
                            className="btn-terminal text-xs px-2 py-1"
                          >
                            <Link className="w-3 h-3 inline mr-1" />
                            LINK
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add deliverable..."
                      value={newDeliverableInputs[phase.id] || ""}
                      onChange={(e) => setNewDeliverableInputs({ ...newDeliverableInputs, [phase.id]: e.target.value })}
                      className="input-terminal flex-1"
                      onKeyDown={(e) => e.key === "Enter" && addPhaseDeliverable(phase.id)}
                    />
                    <button
                      onClick={() => addPhaseDeliverable(phase.id)}
                      className="w-8 h-8 bg-foreground text-background flex items-center justify-center hover:bg-primary"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
