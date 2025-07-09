"use client"

import { useState, useEffect } from "react"
import { ProjectDashboard } from "./components/project-dashboard"
import { ProjectCreation } from "./components/project-creation"
import { ProjectDetail } from "./components/project-detail"
import { projectService, generalTodoService, activityService } from "../lib/supabase"
import type { Project, GeneralTodo, Activity } from "./types/project"

export default function Home() {
  const [currentView, setCurrentView] = useState<"dashboard" | "create" | "detail">("dashboard")
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [generalTodos, setGeneralTodos] = useState<GeneralTodo[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  // Load data from Supabase
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [projectsData, todosData, activitiesData] = await Promise.all([
        projectService.getAll(),
        generalTodoService.getAll(),
        activityService.getAll(),
      ])

      // Transform database data to app format
      const transformedProjects = projectsData.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status as any,
        priority: p.priority as any,
        progress: p.progress,
        startDate: p.start_date,
        endDate: p.end_date,
        image: p.image,
        phases: p.phases || [],
        deliverables: p.deliverables || [],
        todos: p.todos || [],
      }))

      const transformedTodos = todosData.map((t) => ({
        id: t.id,
        text: t.text,
        completed: t.completed,
        priority: t.priority as any,
        dueDate: t.due_date,
        projectId: t.project_id,
      }))

      const transformedActivities = activitiesData.map((a) => ({
        id: a.id,
        type: a.type as any,
        message: a.message,
        timestamp: new Date(a.timestamp),
        projectId: a.project_id,
      }))

      setProjects(transformedProjects)
      setGeneralTodos(transformedTodos)
      setActivities(transformedActivities)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (projectData: Omit<Project, "id">) => {
    try {
      const dbProject = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        priority: projectData.priority,
        progress: projectData.progress,
        start_date:
          typeof projectData.startDate === "string"
            ? projectData.startDate
            : projectData.startDate.toISOString().split("T")[0],
        end_date:
          typeof projectData.endDate === "string"
            ? projectData.endDate
            : projectData.endDate.toISOString().split("T")[0],
        image: projectData.image,
        phases: projectData.phases,
        deliverables: projectData.deliverables,
        todos: projectData.todos,
      }

      const createdProject = await projectService.create(dbProject)

      // Add to local state
      const newProject: Project = {
        id: createdProject.id,
        name: createdProject.name,
        description: createdProject.description,
        status: createdProject.status as any,
        priority: createdProject.priority as any,
        progress: createdProject.progress,
        startDate: createdProject.start_date,
        endDate: createdProject.end_date,
        image: createdProject.image,
        phases: createdProject.phases || [],
        deliverables: createdProject.deliverables || [],
        todos: createdProject.todos || [],
      }

      setProjects([newProject, ...projects])

      // Add activity
      await activityService.create({
        type: "project_created",
        message: `New project '${newProject.name}' created`,
        timestamp: new Date().toISOString(),
        project_id: newProject.id,
      })

      await loadData() // Refresh data
      setCurrentView("dashboard")
    } catch (error) {
      console.error("Error creating project:", error)
    }
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    setCurrentView("detail")
  }

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const dbProject = {
        name: updatedProject.name,
        description: updatedProject.description,
        status: updatedProject.status,
        priority: updatedProject.priority,
        progress: updatedProject.progress,
        start_date:
          typeof updatedProject.startDate === "string"
            ? updatedProject.startDate
            : updatedProject.startDate.toISOString().split("T")[0],
        end_date:
          typeof updatedProject.endDate === "string"
            ? updatedProject.endDate
            : updatedProject.endDate.toISOString().split("T")[0],
        image: updatedProject.image,
        phases: updatedProject.phases,
        deliverables: updatedProject.deliverables,
        todos: updatedProject.todos,
      }

      await projectService.update(updatedProject.id, dbProject)

      setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
      setSelectedProject(updatedProject)

      // Add activity
      await activityService.create({
        type: "project_updated",
        message: `Project '${updatedProject.name}' updated`,
        timestamp: new Date().toISOString(),
        project_id: updatedProject.id,
      })

      await loadData() // Refresh data
    } catch (error) {
      console.error("Error updating project:", error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectService.delete(projectId)
      setProjects(projects.filter((p) => p.id !== projectId))
      setCurrentView("dashboard")
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleUpdateGeneralTodos = async (updatedTodos: GeneralTodo[]) => {
    setGeneralTodos(updatedTodos)
    // Note: Individual todo operations should be handled in the component
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-mono mb-4">LOADING...</div>
          <div className="text-sm text-gray-400">Initializing Project Atlas</div>
        </div>
      </div>
    )
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
