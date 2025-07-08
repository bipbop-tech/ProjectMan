"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Pause,
} from "lucide-react"
import type { Project } from "../types/project"

interface ProjectDashboardProps {
  projects: Project[]
  onCreateProject: () => void
  onViewProject: (project: Project) => void
}

export function ProjectDashboard({ projects = [], onCreateProject, onViewProject }: ProjectDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "active":
        return <TrendingUp className="w-4 h-4" />
      case "on-hold":
        return <Pause className="w-4 h-4" />
      case "planning":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-white text-black"
      case "active":
        return "bg-gray-800 text-white border border-gray-600"
      case "on-hold":
        return "bg-gray-900 text-gray-400 border border-gray-700"
      case "planning":
        return "bg-gray-800 text-gray-300 border border-gray-600"
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

  // Calculate dashboard statistics
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "active").length
  const completedProjects = projects.filter((p) => p.status === "completed").length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const averageProgress =
    projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">PROJECT ATLAS</h1>
            <p className="text-gray-400">Terminal Management System v2.1.0</p>
          </div>
          <Button onClick={onCreateProject} className="bg-white text-black hover:bg-gray-200 font-mono">
            <Plus className="w-4 h-4 mr-2" />
            NEW PROJECT
          </Button>
        </div>

        {/* Terminal-style status line */}
        <div className="bg-gray-900 border border-gray-700 p-3 font-mono text-sm">
          <span className="text-white">{">"}</span> STATUS: OPERATIONAL | PROJECTS: {totalProjects} | ACTIVE:{" "}
          {activeProjects} | COMPLETED: {completedProjects} | UPTIME: 99.9%
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">TOTAL PROJECTS</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <p className="text-xs text-gray-500 mt-1">
              {activeProjects} active, {completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">TEAM MEMBERS</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{projects.reduce((sum, p) => sum + p.team.length, 0)}</div>
            <p className="text-xs text-gray-500 mt-1">Across all projects</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">BUDGET STATUS</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">of ${totalBudget.toLocaleString()} total</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">AVG PROGRESS</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageProgress}%</div>
            <Progress value={averageProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black border-gray-700 text-white placeholder-gray-500 font-mono"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-black border-gray-700 text-white font-mono">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-black border-gray-700 text-white font-mono">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-700">
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="bg-black border-gray-700 hover:border-gray-500 transition-colors cursor-pointer"
            onClick={() => onViewProject(project)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-white mb-2 font-mono">{project.name}</CardTitle>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${getStatusColor(project.status)} font-mono text-xs`}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status.toUpperCase()}</span>
                </Badge>
                <Badge className={`${getPriorityColor(project.priority)} font-mono text-xs`}>
                  {project.priority.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-mono">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block">Budget</span>
                    <span className="text-white font-mono">${project.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Spent</span>
                    <span className="text-white font-mono">${project.spent.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block">Start</span>
                    <span className="text-white font-mono">{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">End</span>
                    <span className="text-white font-mono">{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    {project.team.length} members
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {project.phases.length} phases
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-mono">NO PROJECTS FOUND</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  )
}
