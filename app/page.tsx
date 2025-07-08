"use client"

import { useState } from "react"
import { ProjectDashboard } from "./components/project-dashboard"
import { ProjectCreation } from "./components/project-creation"
import { ProjectDetail } from "./components/project-detail"
import type { Project, GeneralTodo, Activity } from "./types/project"

export default function Home() {
  const [currentView, setCurrentView] = useState<"dashboard" | "create" | "detail">("dashboard")
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [generalTodos, setGeneralTodos] = useState<GeneralTodo[]>([
    {
      id: "1",
      text: "Review quarterly project reports",
      completed: false,
      priority: "high",
      dueDate: "2024-01-25",
    },
    {
      id: "2",
      text: "Update project management documentation",
      completed: false,
      priority: "medium",
    },
    {
      id: "3",
      text: "Schedule team retrospective meeting",
      completed: true,
      priority: "low",
    },
  ])
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "project_created",
      message: "New project 'E-Commerce Platform' created",
      timestamp: new Date("2024-01-15T10:30:00"),
      projectId: "1",
    },
    {
      id: "2",
      type: "phase_completed",
      message: "Planning phase completed for E-Commerce Platform",
      timestamp: new Date("2024-01-14T15:45:00"),
      projectId: "1",
    },
    {
      id: "3",
      type: "deliverable_completed",
      message: "Wireframes deliverable completed",
      timestamp: new Date("2024-01-13T09:20:00"),
      projectId: "1",
    },
  ])

  const handleCreateProject = (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
    }
    setProjects([...projects, newProject])

    // Add activity
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: "project_created",
      message: `New project '${newProject.name}' created`,
      timestamp: new Date(),
      projectId: newProject.id,
    }
    setActivities([newActivity, ...activities])

    setCurrentView("dashboard")
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    setCurrentView("detail")
  }

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
    setSelectedProject(updatedProject)

    // Add activity for project updates
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: "project_updated",
      message: `Project '${updatedProject.name}' updated`,
      timestamp: new Date(),
      projectId: updatedProject.id,
    }
    setActivities([newActivity, ...activities])
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
    setCurrentView("dashboard")
  }

  const handleUpdateGeneralTodos = (updatedTodos: GeneralTodo[]) => {
    setGeneralTodos(updatedTodos)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold terminal-text cursor-blink">PROJECT_ATLAS</h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`btn-terminal ${currentView === "dashboard" ? "bg-primary text-primary-foreground" : ""}`}
            >
              DASHBOARD
            </button>
            <button
              onClick={() => setCurrentView("create")}
              className={`btn-terminal ${currentView === "create" ? "bg-primary text-primary-foreground" : ""}`}
            >
              NEW PROJECT
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {currentView === "dashboard" && (
          <ProjectDashboard
            projects={projects}
            generalTodos={generalTodos}
            activities={activities}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject}
            onUpdateGeneralTodos={handleUpdateGeneralTodos}
          />
        )}
        {currentView === "create" && (
          <ProjectCreation onCreateProject={handleCreateProject} onCancel={() => setCurrentView("dashboard")} />
        )}
        {currentView === "detail" && selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onUpdateProject={handleUpdateProject}
            onBack={() => setCurrentView("dashboard")}
          />
        )}
      </main>
    </div>
  )
}
