"use client"

import { useState, useEffect } from "react"
import { ProjectCreation } from "./components/project-creation"
import { ProjectRoadmap } from "./components/project-roadmap"
import { ProjectDashboard } from "./components/project-dashboard"
import { Analytics } from "./components/analytics"
import type { Project as ProjectType } from "./types/project-atlas"

export interface Project extends ProjectType {}
export interface Deliverable {
  id: string
  title: string
  notes: string
  links: string[]
  files: string[]
  status: "pending" | "in-progress" | "completed"
}

export interface Goal {
  id: string
  title: string
  achieved: boolean
}

export default function ProjectAtlas() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentView, setCurrentView] = useState<"dashboard" | "create" | "roadmap" | "analytics">("dashboard")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Save projects to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("project-atlas-projects", JSON.stringify(projects))
    }
  }, [projects])

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("project-atlas-projects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  const handleCreateProject = (projectData: {
    name: string
    details: string
    image: string
    generalNotes: string
  }) => {
    const roadmap = generateAIRoadmap(projectData.details, projectData.name)

    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      details: projectData.details,
      image: projectData.image,
      generalNotes: projectData.generalNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
      currentPhase: 0,
      overallProgress: 0,
      roadmap,
      tags: [],
      priority: "medium",
      dueDate: "",
    }

    setProjects((prev) => [...prev, newProject])
    setSelectedProject(newProject)
    setCurrentView("roadmap")
  }

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
    setSelectedProject(updatedProject)
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    setCurrentView("roadmap")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedProject(null)
  }

  if (currentView === "create") {
    return <ProjectCreation onSubmit={handleCreateProject} onCancel={() => setCurrentView("dashboard")} />
  }

  if (currentView === "roadmap" && selectedProject) {
    return <ProjectRoadmap project={selectedProject} onBack={handleBackToDashboard} onUpdate={handleUpdateProject} />
  }

  if (currentView === "analytics") {
    return <Analytics projects={projects} onBack={handleBackToDashboard} />
  }

  return (
    <ProjectDashboard
      projects={projects}
      onCreateProject={() => setCurrentView("create")}
      onSelectProject={handleSelectProject}
      onAnalytics={() => setCurrentView("analytics")}
      onUpdateProject={handleUpdateProject}
    />
  )
}

const generateAIRoadmap = (projectDetails: string, projectName: string) => {
  const projectType = detectProjectType(projectDetails)
  const basePhases = getPhaseTemplate(projectType)

  return basePhases.map((phase, index) => ({
    ...phase,
    id: `${Date.now()}-${index}`,
    todos: phase.todos.map((todo, todoIndex) => ({
      ...todo,
      id: `${Date.now()}-${index}-${todoIndex}`,
    })),
    deliverables: phase.deliverables.map((deliverable, delIndex) => ({
      ...deliverable,
      id: `${Date.now()}-${index}-${delIndex}`,
    })),
  }))
}

const detectProjectType = (details: string): "web-app" | "mobile-app" | "marketing" | "general" => {
  const lowerDetails = details.toLowerCase()
  if (lowerDetails.includes("website") || lowerDetails.includes("web app") || lowerDetails.includes("frontend")) {
    return "web-app"
  }
  if (lowerDetails.includes("mobile") || lowerDetails.includes("ios") || lowerDetails.includes("android")) {
    return "mobile-app"
  }
  if (lowerDetails.includes("marketing") || lowerDetails.includes("campaign") || lowerDetails.includes("brand")) {
    return "marketing"
  }
  return "general"
}

const getPhaseTemplate = (type: string) => {
  const templates = {
    "web-app": [
      {
        title: "Project Discovery & Planning",
        description: "Define requirements, user stories, and technical architecture",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 14,
        todos: [
          { text: "Conduct stakeholder interviews", completed: false, priority: "high" },
          { text: "Create user personas and journey maps", completed: false, priority: "high" },
          { text: "Define functional requirements", completed: false, priority: "high" },
          { text: "Choose technology stack", completed: false, priority: "medium" },
          { text: "Create project timeline and milestones", completed: false, priority: "medium" },
        ],
        deliverables: [
          { title: "Requirements Document", notes: "", links: [], files: [], status: "pending" },
          { title: "Technical Architecture Plan", notes: "", links: [], files: [], status: "pending" },
          { title: "User Stories & Acceptance Criteria", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "UI/UX Design",
        description: "Create wireframes, mockups, and interactive prototypes",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 21,
        todos: [
          {
            text: "Create information architecture",
            completed: false,
            priority: "high",
          },
          {
            text: "Design wireframes for key pages",
            completed: false,
            priority: "high",
          },
          {
            text: "Create visual design system",
            completed: false,
            priority: "high",
          },
          {
            text: "Build interactive prototypes",
            completed: false,
            priority: "medium",
          },
          {
            text: "Conduct usability testing",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "Wireframes", notes: "", links: [], files: [], status: "pending" },
          { title: "Visual Design Mockups", notes: "", links: [], files: [], status: "pending" },
          { title: "Interactive Prototype", notes: "", links: [], files: [], status: "pending" },
          { title: "Design System Documentation", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "Frontend Development",
        description: "Build the user interface and client-side functionality",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 35,
        todos: [
          {
            text: "Set up development environment",
            completed: false,
            priority: "high",
          },
          {
            text: "Implement responsive layouts",
            completed: false,
            priority: "high",
          },
          {
            text: "Build reusable UI components",
            completed: false,
            priority: "high",
          },
          {
            text: "Integrate with backend APIs",
            completed: false,
            priority: "high",
          },
          {
            text: "Implement user authentication",
            completed: false,
            priority: "medium",
          },
          {
            text: "Add form validation and error handling",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "Frontend Codebase", notes: "", links: [], files: [], status: "pending" },
          { title: "Component Library", notes: "", links: [], files: [], status: "pending" },
          { title: "Responsive Web Application", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "Backend Development",
        description: "Build server-side logic, APIs, and database integration",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 28,
        todos: [
          {
            text: "Design database schema",
            completed: false,
            priority: "high",
          },
          {
            text: "Set up server infrastructure",
            completed: false,
            priority: "high",
          },
          {
            text: "Build REST API endpoints",
            completed: false,
            priority: "high",
          },
          {
            text: "Implement authentication system",
            completed: false,
            priority: "high",
          },
          {
            text: "Add data validation and security",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "API Documentation", notes: "", links: [], files: [], status: "pending" },
          { title: "Database Schema", notes: "", links: [], files: [], status: "pending" },
          { title: "Backend Codebase", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "Testing & Quality Assurance",
        description: "Comprehensive testing and bug fixes",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 14,
        todos: [
          { text: "Write unit tests", completed: false, priority: "high" },
          {
            text: "Conduct integration testing",
            completed: false,
            priority: "high",
          },
          {
            text: "Perform user acceptance testing",
            completed: false,
            priority: "high",
          },
          {
            text: "Test cross-browser compatibility",
            completed: false,
            priority: "medium",
          },
          {
            text: "Performance optimization",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "Test Results Report", notes: "", links: [], files: [], status: "pending" },
          { title: "Bug Fix Documentation", notes: "", links: [], files: [], status: "pending" },
          { title: "Performance Audit", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "Deployment & Launch",
        description: "Deploy to production and launch the application",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 7,
        todos: [
          {
            text: "Set up production environment",
            completed: false,
            priority: "high",
          },
          {
            text: "Configure domain and SSL",
            completed: false,
            priority: "high",
          },
          { text: "Deploy application", completed: false, priority: "high" },
          {
            text: "Monitor system performance",
            completed: false,
            priority: "medium",
          },
          {
            text: "Create user documentation",
            completed: false,
            priority: "low",
          },
        ],
        deliverables: [
          { title: "Live Application", notes: "", links: [], files: [], status: "pending" },
          { title: "Deployment Guide", notes: "", links: [], files: [], status: "pending" },
          { title: "User Manual", notes: "", links: [], files: [], status: "pending" },
        ],
      },
    ],
    "mobile-app": [
      {
        title: "App Concept & Strategy",
        description: "Define app concept, target audience, and platform strategy",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 10,
        todos: [
          {
            text: "Define app concept and unique value proposition",
            completed: false,
            priority: "high",
          },
          {
            text: "Research target audience and competitors",
            completed: false,
            priority: "high",
          },
          {
            text: "Choose platforms (iOS, Android, or both)",
            completed: false,
            priority: "high",
          },
          {
            text: "Create feature prioritization matrix",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "App Concept Document", notes: "", links: [], files: [], status: "pending" },
          { title: "Market Research Report", notes: "", links: [], files: [], status: "pending" },
          { title: "Feature Specification", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "UI/UX Design",
        description: "Create mobile-first design and user experience",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 21,
        todos: [
          {
            text: "Create user flow diagrams",
            completed: false,
            priority: "high",
          },
          {
            text: "Design wireframes for all screens",
            completed: false,
            priority: "high",
          },
          {
            text: "Create visual design and branding",
            completed: false,
            priority: "high",
          },
          {
            text: "Build interactive prototype",
            completed: false,
            priority: "medium",
          },
          {
            text: "Test usability with target users",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "Mobile Wireframes", notes: "", links: [], files: [], status: "pending" },
          { title: "Visual Design Mockups", notes: "", links: [], files: [], status: "pending" },
          { title: "Interactive Prototype", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "Mobile Development",
        description: "Build native or cross-platform mobile application",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 42,
        todos: [
          {
            text: "Set up development environment",
            completed: false,
            priority: "high",
          },
          {
            text: "Implement core app navigation",
            completed: false,
            priority: "high",
          },
          {
            text: "Build key features and functionality",
            completed: false,
            priority: "high",
          },
          {
            text: "Integrate device features (camera, GPS, etc.)",
            completed: false,
            priority: "medium",
          },
          {
            text: "Implement push notifications",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "Mobile App Codebase", notes: "", links: [], files: [], status: "pending" },
          { title: "Beta Version", notes: "", links: [], files: [], status: "pending" },
        ],
      },
    ],
    marketing: [
      {
        title: "Campaign Strategy",
        description: "Define marketing objectives and target audience",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 7,
        todos: [
          {
            text: "Define campaign objectives and KPIs",
            completed: false,
            priority: "high",
          },
          {
            text: "Research target audience and personas",
            completed: false,
            priority: "high",
          },
          {
            text: "Analyze competitor campaigns",
            completed: false,
            priority: "medium",
          },
          {
            text: "Choose marketing channels and tactics",
            completed: false,
            priority: "high",
          },
        ],
        deliverables: [
          { title: "Campaign Strategy Document", notes: "", links: [], files: [], status: "pending" },
          { title: "Target Audience Analysis", notes: "", links: [], files: [], status: "pending" },
          { title: "Channel Strategy Plan", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "Creative Development",
        description: "Create marketing assets and content",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 14,
        todos: [
          {
            text: "Develop creative concepts and themes",
            completed: false,
            priority: "high",
          },
          {
            text: "Create visual assets and graphics",
            completed: false,
            priority: "high",
          },
          {
            text: "Write copy and messaging",
            completed: false,
            priority: "high",
          },
          {
            text: "Produce video or multimedia content",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "Creative Assets Library", notes: "", links: [], files: [], status: "pending" },
          { title: "Campaign Copy", notes: "", links: [], files: [], status: "pending" },
          { title: "Brand Guidelines", notes: "", links: [], files: [], status: "pending" },
        ],
      },
    ],
    general: [
      {
        title: "Project Initiation",
        description: "Define project scope, objectives, and initial planning",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 7,
        todos: [
          {
            text: "Define project objectives and success criteria",
            completed: false,
            priority: "high",
          },
          {
            text: "Identify key stakeholders",
            completed: false,
            priority: "high",
          },
          {
            text: "Conduct initial feasibility analysis",
            completed: false,
            priority: "medium",
          },
          {
            text: "Create project charter",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "Project Charter", notes: "", links: [], files: [], status: "pending" },
          { title: "Stakeholder Analysis", notes: "", links: [], files: [], status: "pending" },
        ],
      },
      {
        title: "Planning & Design",
        description: "Detailed planning and solution design",
        status: "pending" as const,
        progress: 0,
        estimatedDuration: 14,
        todos: [
          {
            text: "Create detailed project plan",
            completed: false,
            priority: "high",
          },
          {
            text: "Design solution architecture",
            completed: false,
            priority: "high",
          },
          {
            text: "Plan resource allocation",
            completed: false,
            priority: "medium",
          },
          {
            text: "Establish quality processes",
            completed: false,
            priority: "medium",
          },
        ],
        deliverables: [
          { title: "Project Plan", notes: "", links: [], files: [], status: "pending" },
          { title: "Solution Design", notes: "", links: [], files: [], status: "pending" },
        ],
      },
    ],
  }

  return templates[type as keyof typeof templates] || templates.general
}
