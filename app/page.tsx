"use client"

import { useState } from "react"
import { ProjectDashboard } from "./components/project-dashboard"
import { ProjectCreation } from "./components/project-creation"
import { ProjectDetail } from "./components/project-detail"
import type { Project } from "./types/project"

export default function Home() {
  const [currentView, setCurrentView] = useState<"dashboard" | "create" | "detail">("dashboard")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-Commerce Platform",
      description: "Building a modern e-commerce platform with React and Node.js",
      status: "active",
      priority: "high",
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      progress: 65,
      budget: 150000,
      spent: 97500,
      phases: [
        {
          id: "1",
          name: "Planning & Design",
          description: "Initial planning and UI/UX design phase",
          status: "completed",
          startDate: "2024-01-15",
          endDate: "2024-02-15",
          progress: 100,
          dependencies: [],
          deliverables: [
            {
              id: "1",
              name: "Wireframes",
              description: "Complete wireframes for all pages",
              status: "completed",
              dueDate: "2024-02-01",
              assignee: "Sarah Chen",
              priority: "high",
            },
            {
              id: "2",
              name: "Design System",
              description: "Component library and design tokens",
              status: "completed",
              dueDate: "2024-02-10",
              assignee: "Mike Johnson",
              priority: "medium",
            },
          ],
        },
        {
          id: "2",
          name: "Frontend Development",
          description: "React frontend implementation",
          status: "in-progress",
          startDate: "2024-02-16",
          endDate: "2024-04-30",
          progress: 75,
          dependencies: ["1"],
          deliverables: [
            {
              id: "3",
              name: "Product Catalog",
              description: "Product listing and detail pages",
              status: "completed",
              dueDate: "2024-03-15",
              assignee: "Alex Rodriguez",
              priority: "high",
            },
            {
              id: "4",
              name: "Shopping Cart",
              description: "Cart functionality and checkout flow",
              status: "in-progress",
              dueDate: "2024-04-01",
              assignee: "Emily Davis",
              priority: "critical",
            },
          ],
        },
        {
          id: "3",
          name: "Backend Development",
          description: "API and database implementation",
          status: "in-progress",
          startDate: "2024-03-01",
          endDate: "2024-05-15",
          progress: 45,
          dependencies: ["1"],
          deliverables: [
            {
              id: "5",
              name: "User Authentication",
              description: "Login, registration, and user management",
              status: "completed",
              dueDate: "2024-03-20",
              assignee: "David Kim",
              priority: "high",
            },
            {
              id: "6",
              name: "Payment Integration",
              description: "Stripe payment processing",
              status: "pending",
              dueDate: "2024-04-15",
              assignee: "Lisa Wang",
              priority: "critical",
            },
          ],
        },
      ],
      team: [
        { id: "1", name: "Sarah Chen", role: "UI/UX Designer", email: "sarah@company.com" },
        { id: "2", name: "Mike Johnson", role: "Frontend Lead", email: "mike@company.com" },
        { id: "3", name: "Alex Rodriguez", role: "Frontend Developer", email: "alex@company.com" },
        { id: "4", name: "Emily Davis", role: "Frontend Developer", email: "emily@company.com" },
        { id: "5", name: "David Kim", role: "Backend Lead", email: "david@company.com" },
        { id: "6", name: "Lisa Wang", role: "Backend Developer", email: "lisa@company.com" },
      ],
      todos: [
        {
          id: "1",
          text: "Review payment gateway integration",
          completed: false,
          priority: "high",
          dueDate: "2024-01-20",
        },
        { id: "2", text: "Update project documentation", completed: false, priority: "medium" },
        { id: "3", text: "Schedule client demo", completed: true, priority: "high" },
      ],
    },
    {
      id: "2",
      name: "Mobile App Redesign",
      description: "Complete redesign of the mobile application",
      status: "planning",
      priority: "medium",
      startDate: "2024-02-01",
      endDate: "2024-08-15",
      progress: 15,
      budget: 80000,
      spent: 12000,
      phases: [
        {
          id: "4",
          name: "Research & Analysis",
          description: "User research and competitive analysis",
          status: "in-progress",
          startDate: "2024-02-01",
          endDate: "2024-03-01",
          progress: 60,
          dependencies: [],
          deliverables: [
            {
              id: "7",
              name: "User Research Report",
              description: "Comprehensive user research findings",
              status: "in-progress",
              dueDate: "2024-02-20",
              assignee: "Jennifer Liu",
              priority: "high",
            },
          ],
        },
      ],
      team: [
        { id: "7", name: "Jennifer Liu", role: "UX Researcher", email: "jennifer@company.com" },
        { id: "8", name: "Tom Wilson", role: "Mobile Developer", email: "tom@company.com" },
      ],
      todos: [
        { id: "4", text: "Conduct user interviews", completed: false, priority: "high", dueDate: "2024-01-25" },
        { id: "5", text: "Analyze competitor apps", completed: true, priority: "medium" },
      ],
    },
  ])

  const handleCreateProject = (project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    }
    setProjects([...projects, newProject])
    setCurrentView("dashboard")
  }

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
    setSelectedProject(updatedProject)
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
    setCurrentView("dashboard")
    setSelectedProject(null)
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setCurrentView("detail")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {currentView === "dashboard" && (
        <ProjectDashboard
          projects={projects}
          onCreateProject={() => setCurrentView("create")}
          onViewProject={handleViewProject}
        />
      )}
      {currentView === "create" && (
        <ProjectCreation onCreateProject={handleCreateProject} onCancel={() => setCurrentView("dashboard")} />
      )}
      {currentView === "detail" && selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onBack={() => setCurrentView("dashboard")}
        />
      )}
    </div>
  )
}
