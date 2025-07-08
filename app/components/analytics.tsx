"use client"

import { ArrowLeft, TrendingUp, Clock, Target, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Project } from "../types/project-atlas"

interface AnalyticsProps {
  projects: Project[]
  onBack: () => void
}

export function Analytics({ projects, onBack }: AnalyticsProps) {
  // Calculate analytics data
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "active").length
  const completedProjects = projects.filter((p) => p.status === "completed").length
  const onHoldProjects = projects.filter((p) => p.status === "on-hold").length

  const avgProgress =
    totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + p.overallProgress, 0) / totalProjects) : 0

  const totalTasks = projects.reduce(
    (acc, project) => acc + project.roadmap.reduce((phaseAcc, phase) => phaseAcc + phase.todos.length, 0),
    0,
  )

  const completedTasks = projects.reduce(
    (acc, project) =>
      acc +
      project.roadmap.reduce((phaseAcc, phase) => phaseAcc + phase.todos.filter((todo) => todo.completed).length, 0),
    0,
  )

  // Project performance data
  const projectPerformance = projects.map((project) => ({
    name: project.name,
    progress: project.overallProgress,
    status: project.status,
    tasksCompleted: project.roadmap.reduce(
      (acc, phase) => acc + phase.todos.filter((todo) => todo.completed).length,
      0,
    ),
    totalTasks: project.roadmap.reduce((acc, phase) => acc + phase.todos.length, 0),
    createdAt: project.createdAt,
  }))

  // Recent activity simulation
  const recentActivity = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 p-2 hover:bg-white/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-light text-slate-900 mb-2">Analytics Dashboard</h1>
              <p className="text-slate-600">Project insights and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-slate-600">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Projects</p>
                  <p className="text-3xl font-bold text-slate-900">{totalProjects}</p>
                  <p className="text-xs text-slate-500 mt-1">All time</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Projects</p>
                  <p className="text-3xl font-bold text-slate-900">{activeProjects}</p>
                  <p className="text-xs text-slate-500 mt-1">In progress</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Progress</p>
                  <p className="text-3xl font-bold text-slate-900">{avgProgress}%</p>
                  <p className="text-xs text-slate-500 mt-1">Across all projects</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Task Completion</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Overall rate</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Performance */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-slate-900">Project Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectPerformance.map((project, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{project.name}</h4>
                      <Badge
                        className={`text-xs ${
                          project.status === "active"
                            ? "bg-blue-100 text-blue-700"
                            : project.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Progress</span>
                      <span className="text-sm font-medium text-slate-900">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {project.tasksCompleted}/{project.totalTasks} tasks completed
                      </span>
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Task Completion Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-slate-900">Task Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                  </div>
                  <p className="text-slate-600">Overall completion rate</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Completed Tasks</span>
                    <span className="text-sm font-medium text-slate-900">{completedTasks}</span>
                  </div>
                  <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Remaining Tasks</span>
                    <span className="text-sm font-medium text-slate-900">{totalTasks - completedTasks}</span>
                  </div>
                  <Progress
                    value={totalTasks > 0 ? ((totalTasks - completedTasks) / totalTasks) * 100 : 0}
                    className="h-2"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3">Project Status Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Active</span>
                      <span className="text-sm font-medium text-blue-600">{activeProjects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Completed</span>
                      <span className="text-sm font-medium text-emerald-600">{completedProjects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">On Hold</span>
                      <span className="text-sm font-medium text-amber-600">{onHoldProjects}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-slate-900">Recent Project Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((project) => (
                <div key={project.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.name}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{project.name}</h4>
                    <p className="text-sm text-slate-600">
                      Last updated {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-slate-900">{project.overallProgress}%</div>
                    <Badge
                      className={`text-xs ${
                        project.status === "active"
                          ? "bg-blue-100 text-blue-700"
                          : project.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
