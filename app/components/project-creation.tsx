"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Upload, Calendar, Users, Target, Zap } from "lucide-react"
import type { Project, Phase, TeamMember, Deliverable } from "../types/project"

interface ProjectCreationProps {
  onCreateProject: (project: Omit<Project, "id">) => void
  onCancel: () => void
}

export function ProjectCreation({ onCreateProject, onCancel }: ProjectCreationProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning" as const,
    priority: "medium" as const,
    startDate: "",
    endDate: "",
    budget: 0,
    image: "",
  })

  const [phases, setPhases] = useState<Omit<Phase, "id">[]>([])
  const [team, setTeam] = useState<Omit<TeamMember, "id">[]>([])
  const [currentPhase, setCurrentPhase] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    dependencies: [] as string[],
  })
  const [currentMember, setCurrentMember] = useState({
    name: "",
    role: "",
    email: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const addPhase = () => {
    if (currentPhase.name && currentPhase.description) {
      const newPhase: Omit<Phase, "id"> = {
        ...currentPhase,
        status: "pending",
        progress: 0,
        deliverables: generateDeliverables(currentPhase.name),
        dependencies: currentPhase.dependencies,
      }
      setPhases([...phases, newPhase])
      setCurrentPhase({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        dependencies: [],
      })
    }
  }

  const generateDeliverables = (phaseName: string): Omit<Deliverable, "id">[] => {
    const deliverableTemplates = {
      Planning: [
        { name: "Project Charter", description: "Define project scope and objectives" },
        { name: "Requirements Document", description: "Detailed functional requirements" },
        { name: "Timeline & Milestones", description: "Project schedule and key milestones" },
      ],
      Design: [
        { name: "Wireframes", description: "Low-fidelity page layouts" },
        { name: "UI Mockups", description: "High-fidelity visual designs" },
        { name: "Design System", description: "Component library and style guide" },
      ],
      Development: [
        { name: "Core Features", description: "Primary application functionality" },
        { name: "API Integration", description: "Backend service connections" },
        { name: "Testing Suite", description: "Unit and integration tests" },
      ],
      Testing: [
        { name: "Test Cases", description: "Comprehensive test scenarios" },
        { name: "Bug Reports", description: "Issue tracking and resolution" },
        { name: "Performance Testing", description: "Load and stress testing" },
      ],
      Deployment: [
        { name: "Production Setup", description: "Server configuration and deployment" },
        { name: "Documentation", description: "User and technical documentation" },
        { name: "Training Materials", description: "End-user training resources" },
      ],
    }

    const matchedTemplate = Object.keys(deliverableTemplates).find((key) =>
      phaseName.toLowerCase().includes(key.toLowerCase()),
    )

    const templates = matchedTemplate
      ? deliverableTemplates[matchedTemplate as keyof typeof deliverableTemplates]
      : [
          { name: "Phase Deliverable 1", description: "Primary deliverable for this phase" },
          { name: "Phase Deliverable 2", description: "Secondary deliverable for this phase" },
        ]

    return templates.map((template) => ({
      ...template,
      status: "pending" as const,
      dueDate: currentPhase.endDate,
      assignee: "Unassigned",
      priority: "medium" as const,
    }))
  }

  const addTeamMember = () => {
    if (currentMember.name && currentMember.role && currentMember.email) {
      setTeam([...team, currentMember])
      setCurrentMember({ name: "", role: "", email: "" })
    }
  }

  const removePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index))
  }

  const removeMember = (index: number) => {
    setTeam(team.filter((_, i) => i !== index))
  }

  const generateAutoPhases = () => {
    const autoPhases: Omit<Phase, "id">[] = [
      {
        name: "Planning & Analysis",
        description: "Project planning, requirements gathering, and initial analysis",
        status: "pending",
        startDate: formData.startDate,
        endDate: calculatePhaseEndDate(formData.startDate, 2),
        progress: 0,
        deliverables: generateDeliverables("Planning"),
        dependencies: [],
      },
      {
        name: "Design & Architecture",
        description: "UI/UX design and system architecture planning",
        status: "pending",
        startDate: calculatePhaseEndDate(formData.startDate, 2),
        endDate: calculatePhaseEndDate(formData.startDate, 4),
        progress: 0,
        deliverables: generateDeliverables("Design"),
        dependencies: [],
      },
      {
        name: "Development",
        description: "Core development and implementation phase",
        status: "pending",
        startDate: calculatePhaseEndDate(formData.startDate, 4),
        endDate: calculatePhaseEndDate(formData.startDate, 10),
        progress: 0,
        deliverables: generateDeliverables("Development"),
        dependencies: [],
      },
      {
        name: "Testing & QA",
        description: "Quality assurance, testing, and bug fixes",
        status: "pending",
        startDate: calculatePhaseEndDate(formData.startDate, 10),
        endDate: calculatePhaseEndDate(formData.startDate, 12),
        progress: 0,
        deliverables: generateDeliverables("Testing"),
        dependencies: [],
      },
      {
        name: "Deployment & Launch",
        description: "Production deployment and project launch",
        status: "pending",
        startDate: calculatePhaseEndDate(formData.startDate, 12),
        endDate: formData.endDate,
        progress: 0,
        deliverables: generateDeliverables("Deployment"),
        dependencies: [],
      },
    ]
    setPhases(autoPhases)
  }

  const calculatePhaseEndDate = (startDate: string, weeksToAdd: number): string => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + weeksToAdd * 7)
    return date.toISOString().split("T")[0]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const project: Omit<Project, "id"> = {
      ...formData,
      progress: 0,
      spent: 0,
      phases: phases.map((phase, index) => ({
        ...phase,
        id: (index + 1).toString(),
        deliverables: phase.deliverables.map((deliverable, dIndex) => ({
          ...deliverable,
          id: `${index + 1}-${dIndex + 1}`,
        })),
      })),
      team: team.map((member, index) => ({
        ...member,
        id: (index + 1).toString(),
      })),
      todos: [],
    }

    onCreateProject(project)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onCancel} className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">CREATE PROJECT</h1>
              <p className="text-gray-400">Initialize new project in system</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-3 font-mono text-sm">
          <span className="text-white">{">"}</span> MODE: PROJECT_CREATION | STATUS: READY | VALIDATION: ACTIVE
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="bg-black border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white font-mono">
              <Target className="w-5 h-5 mr-2" />
              PROJECT DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-400 font-mono">
                  PROJECT NAME *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black border-gray-700 text-white font-mono"
                  placeholder="Enter project name..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="priority" className="text-gray-400 font-mono">
                  PRIORITY
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="bg-black border-gray-700 text-white font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-700">
                    <SelectItem value="low">LOW</SelectItem>
                    <SelectItem value="medium">MEDIUM</SelectItem>
                    <SelectItem value="high">HIGH</SelectItem>
                    <SelectItem value="critical">CRITICAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-400 font-mono">
                DESCRIPTION *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-black border-gray-700 text-white font-mono min-h-[100px]"
                placeholder="Describe the project objectives and scope..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-gray-400 font-mono">
                  START DATE *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-black border-gray-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate" className="text-gray-400 font-mono">
                  END DATE *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-black border-gray-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <Label htmlFor="budget" className="text-gray-400 font-mono">
                  BUDGET ($)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="bg-black border-gray-700 text-white font-mono"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-gray-400 font-mono">PROJECT IMAGE</Label>
              <div className="mt-2">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 hover:border-gray-500 cursor-pointer transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-400 font-mono">CLICK TO UPLOAD IMAGE</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Phases */}
        <Card className="bg-black border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-white font-mono">
                <Calendar className="w-5 h-5 mr-2" />
                PROJECT PHASES
              </CardTitle>
              <Button
                type="button"
                onClick={generateAutoPhases}
                className="bg-gray-800 text-white hover:bg-gray-700 font-mono"
              >
                <Zap className="w-4 h-4 mr-2" />
                AUTO-GENERATE
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Phase Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-800 rounded">
              <Input
                placeholder="Phase name..."
                value={currentPhase.name}
                onChange={(e) => setCurrentPhase({ ...currentPhase, name: e.target.value })}
                className="bg-black border-gray-700 text-white font-mono"
              />
              <Input
                placeholder="Phase description..."
                value={currentPhase.description}
                onChange={(e) => setCurrentPhase({ ...currentPhase, description: e.target.value })}
                className="bg-black border-gray-700 text-white font-mono"
              />
              <Input
                type="date"
                placeholder="Start date"
                value={currentPhase.startDate}
                onChange={(e) => setCurrentPhase({ ...currentPhase, startDate: e.target.value })}
                className="bg-black border-gray-700 text-white font-mono"
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="End date"
                  value={currentPhase.endDate}
                  onChange={(e) => setCurrentPhase({ ...currentPhase, endDate: e.target.value })}
                  className="bg-black border-gray-700 text-white font-mono flex-1"
                />
                <Button type="button" onClick={addPhase} className="bg-white text-black hover:bg-gray-200 font-mono">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Phases List */}
            <div className="space-y-2">
              {phases.map((phase, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-800 rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-mono font-bold">{phase.name}</span>
                      <Badge className="bg-gray-800 text-gray-300 font-mono text-xs">
                        {phase.deliverables.length} deliverables
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">{phase.description}</p>
                    <p className="text-gray-500 text-xs font-mono mt-1">
                      {phase.startDate} → {phase.endDate}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePhase(index)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="bg-black border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white font-mono">
              <Users className="w-5 h-5 mr-2" />
              TEAM MEMBERS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Member Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-800 rounded">
              <Input
                placeholder="Full name..."
                value={currentMember.name}
                onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                className="bg-black border-gray-700 text-white font-mono"
              />
              <Input
                placeholder="Role/Title..."
                value={currentMember.role}
                onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                className="bg-black border-gray-700 text-white font-mono"
              />
              <Input
                type="email"
                placeholder="Email address..."
                value={currentMember.email}
                onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                className="bg-black border-gray-700 text-white font-mono"
              />
              <Button type="button" onClick={addTeamMember} className="bg-white text-black hover:bg-gray-200 font-mono">
                <Plus className="w-4 h-4 mr-2" />
                ADD
              </Button>
            </div>

            {/* Team List */}
            <div className="space-y-2">
              {team.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-800 rounded">
                  <div>
                    <div className="text-white font-mono font-bold">{member.name}</div>
                    <div className="text-gray-400 text-sm">{member.role}</div>
                    <div className="text-gray-500 text-xs font-mono">{member.email}</div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(index)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-400 hover:text-white font-mono">
            CANCEL
          </Button>
          <Button type="submit" className="bg-white text-black hover:bg-gray-200 font-mono">
            CREATE PROJECT
          </Button>
        </div>
      </form>
    </div>
  )
}
