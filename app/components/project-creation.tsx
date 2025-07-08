"use client"

import type React from "react"
import { useState } from "react"
import type { Project, Phase } from "../types/project"

interface ProjectCreationProps {
  onCreateProject: (project: Omit<Project, "id">) => void
  onCancel: () => void
}

const generateDefaultPhases = (): Phase[] => {
  return [
    {
      id: "phase-1",
      name: "Phase 1: Discovery & Planning",
      status: "planning",
      progress: 0,
      items: [
        {
          id: "item-1-1",
          name: "Hold a project kickoff meeting with all stakeholders to align on goals",
          completed: false,
        },
        {
          id: "item-1-2",
          name: "Define the website's primary objectives (e.g., generate sales, capture leads, provide information)",
          completed: false,
        },
        { id: "item-1-3", name: "Identify and research the target audience", completed: false },
        { id: "item-1-4", name: "Conduct competitor analysis to understand the market landscape", completed: false },
        {
          id: "item-1-5",
          name: "Gather all necessary client assets (logos, brand guidelines, initial content)",
          completed: false,
        },
        {
          id: "item-1-6",
          name: "Define the full scope of the project, including all features and functionalities",
          completed: false,
        },
        {
          id: "item-1-7",
          name: "Create a sitemap to outline the website's structure and hierarchy of pages",
          completed: false,
        },
        { id: "item-1-8", name: "Decide on the technology stack (e.g., WordPress, React, Shopify)", completed: false },
        { id: "item-1-9", name: "Establish a clear project timeline with major milestones", completed: false },
      ],
      deliverables: [
        {
          id: "del-1-1",
          name: "Project Brief: A document summarizing goals, audience, and objectives",
          status: "pending",
          files: [],
          links: [],
        },
        {
          id: "del-1-2",
          name: "Sitemap Diagram: A visual chart of the website's page structure",
          status: "pending",
          files: [],
          links: [],
        },
        {
          id: "del-1-3",
          name: "Scope of Work (SOW): A formal document detailing all features, deliverables, timeline, and costs",
          status: "pending",
          files: [],
          links: [],
        },
        {
          id: "del-1-4",
          name: "User Personas: Profiles representing the ideal website visitor",
          status: "pending",
          files: [],
          links: [],
        },
      ],
    },
    {
      id: "phase-2",
      name: "Phase 2: UX/UI Design",
      status: "planning",
      progress: 0,
      items: [
        {
          id: "item-2-1",
          name: "Create user flow diagrams to map out key user journeys (e.g., checkout process, contact form submission)",
          completed: false,
        },
        {
          id: "item-2-2",
          name: "Develop low-fidelity wireframes to establish the layout and structure of key pages without focusing on color or style",
          completed: false,
        },
        {
          id: "item-2-3",
          name: "Create high-fidelity mockups, which are full-color, pixel-perfect representations of the final design",
          completed: false,
        },
        {
          id: "item-2-4",
          name: "Design for a 'mobile-first' or responsive approach, ensuring the site looks great on all devices",
          completed: false,
        },
        {
          id: "item-2-5",
          name: "Create a style guide defining the project's color palette, typography, button styles, and other UI elements",
          completed: false,
        },
        {
          id: "item-2-6",
          name: "Present designs to the client for feedback and perform necessary revisions",
          completed: false,
        },
      ],
      deliverables: [
        {
          id: "del-2-1",
          name: "Wireframes: The structural blueprint for the website",
          status: "pending",
          files: [],
          links: [],
        },
        {
          id: "del-2-2",
          name: "High-Fidelity Mockups: A complete visual design of the website (often provided as Figma, Adobe XD, or Sketch files)",
          status: "pending",
          files: [],
          links: [],
        },
        {
          id: "del-2-3",
          name: "Style Guide / UI Kit: A document or file containing all design elements for consistency",
          status: "pending",
          files: [],
          links: [],
        },
        {
          id: "del-2-4",
          name: "Interactive Prototype (Optional): A clickable mockup that simulates user interaction",
          status: "pending",
          files: [],
          links: [],
        },
      ],
    },
    {
      id: "phase-3",
      name: "Phase 3: Development",
      status: "planning",
      progress: 0,
      items: [
        {
          id: "item-3-1",
          name: "Set up the development environment (local server, staging server, version control like Git)",
          completed: false,
        },
        { id: "item-3-2", name: "Code the front-end of the website using HTML, CSS, and JavaScript", completed: false },
        {
          id: "item-3-3",
          name: "Develop the back-end, including server-side logic and database setup",
          completed: false,
        },
        {
          id: "item-3-4",
          name: "Integrate a Content Management System (CMS) like WordPress or a headless CMS if required",
          completed: false,
        },
        { id: "item-3-5", name: "Connect the front-end and back-end", completed: false },
        { id: "item-3-6", name: "Implement all planned features and interactive elements", completed: false },
        {
          id: "item-3-7",
          name: "Ensure the code is responsive so the design adapts to different screen sizes",
          completed: false,
        },
        {
          id: "item-3-8",
          name: "Perform basic on-page SEO implementation (e.g., proper heading tags, meta tag fields)",
          completed: false,
        },
      ],
      deliverables: [
        {
          id: "del-3-1",
          name: "Functional Codebase: Stored in a version control repository (e.g., GitHub)",
          status: "pending",
          files: [],
          links: [],
        },
        {
          id: "del-3-2",
          name: "Working Website on a Staging Server: A private, fully functional version of the site for testing purposes",
          status: "pending",
          files: [],
          links: [],
        },
        {
          id: "del-3-3",
          name: "Database Schema: The structure and tables for the website's database",
          status: "pending",
          files: [],
          links: [],
        },
      ],
    },
  ]
}

export function ProjectCreation({ onCreateProject, onCancel }: ProjectCreationProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning" as const,
    priority: "medium" as const,
    startDate: "",
    endDate: "",
    progress: 0,
    image: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "PROJECT NAME IS REQUIRED"
    }

    if (!formData.description.trim()) {
      newErrors.description = "DESCRIPTION IS REQUIRED"
    }

    if (!formData.startDate) {
      newErrors.startDate = "START DATE IS REQUIRED"
    }

    if (!formData.endDate) {
      newErrors.endDate = "END DATE IS REQUIRED"
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "END DATE MUST BE AFTER START DATE"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const project: Omit<Project, "id"> = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      phases: generateDefaultPhases(),
      todos: [],
      deliverables: [],
    }

    onCreateProject(project)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        handleInputChange("image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-terminal p-6">
        <h2 className="text-2xl font-bold terminal-text uppercase mb-6 cursor-blink">CREATE_NEW_PROJECT</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm text-muted-foreground uppercase tracking-wider mb-2">PROJECT NAME *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`input-terminal w-full ${errors.name ? "border-destructive" : ""}`}
              placeholder="ENTER PROJECT NAME..."
            />
            {errors.name && <div className="text-destructive text-xs mt-1 terminal-text">ERROR: {errors.name}</div>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-muted-foreground uppercase tracking-wider mb-2">DESCRIPTION *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`input-terminal w-full h-24 resize-none ${errors.description ? "border-destructive" : ""}`}
              placeholder="DESCRIBE THE PROJECT..."
            />
            {errors.description && (
              <div className="text-destructive text-xs mt-1 terminal-text">ERROR: {errors.description}</div>
            )}
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-sm text-muted-foreground uppercase tracking-wider mb-2">PROJECT IMAGE</label>
            <div className="space-y-3">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="input-terminal w-full" />
              {formData.image && (
                <div className="border border-border p-2">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Project preview"
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange("image", "")}
                    className="btn-terminal btn-terminal-danger mt-2 text-xs px-2 py-1"
                  >
                    REMOVE IMAGE
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground uppercase tracking-wider mb-2">STATUS</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="input-terminal w-full"
              >
                <option value="planning">PLANNING</option>
                <option value="active">ACTIVE</option>
                <option value="hold">HOLD</option>
                <option value="completed">COMPLETED</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground uppercase tracking-wider mb-2">PRIORITY</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="input-terminal w-full"
              >
                <option value="low">LOW</option>
                <option value="medium">MEDIUM</option>
                <option value="high">HIGH</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground uppercase tracking-wider mb-2">START DATE *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={`input-terminal w-full ${errors.startDate ? "border-destructive" : ""}`}
              />
              {errors.startDate && (
                <div className="text-destructive text-xs mt-1 terminal-text">ERROR: {errors.startDate}</div>
              )}
            </div>

            <div>
              <label className="block text-sm text-muted-foreground uppercase tracking-wider mb-2">END DATE *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={`input-terminal w-full ${errors.endDate ? "border-destructive" : ""}`}
              />
              {errors.endDate && (
                <div className="text-destructive text-xs mt-1 terminal-text">ERROR: {errors.endDate}</div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm text-muted-foreground uppercase tracking-wider mb-2">
              INITIAL PROGRESS
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange("progress", Number.parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="terminal-text w-12 text-right">{formData.progress}%</span>
            </div>
            <div className="progress-retro h-2 mt-2">
              <div className="progress-fill h-full" style={{ width: `${formData.progress}%` }} />
            </div>
          </div>

          {/* Info about auto-generated phases */}
          <div className="card-terminal bg-muted/20 p-4">
            <div className="text-sm text-muted-foreground terminal-text mb-2">AUTO-GENERATED CONTENT:</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• 3 COMPREHENSIVE PROJECT PHASES</div>
              <div>• 20+ PRE-DEFINED TASKS AND CHECKLIST ITEMS</div>
              <div>• 10+ KEY DELIVERABLES AND MILESTONES</div>
              <div>• FULLY EDITABLE AFTER CREATION</div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-terminal flex-1">
              CREATE PROJECT WITH PHASES
            </button>
            <button type="button" onClick={onCancel} className="btn-terminal btn-terminal-danger">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
