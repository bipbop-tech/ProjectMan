"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Calendar, Target, CheckCircle2, Clock, Edit2, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Project, Deliverable, Goal } from "../page"

interface ProjectDetailProps {
  project: Project
  onBack: () => void
  onUpdate: (project: Project) => void
}

export function ProjectDetail({ project, onBack, onUpdate }: ProjectDetailProps) {
  const [editingProject, setEditingProject] = useState(false)
  const [showDeliverableForm, setShowDeliverableForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingDeliverable, setEditingDeliverable] = useState<Deliverable | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const [projectForm, setProjectForm] = useState({
    name: project.name,
    client: project.client,
    startDate: project.startDate,
    endDate: project.endDate,
    description: project.description,
    status: project.status,
    progress: project.progress,
  })

  const [deliverableForm, setDeliverableForm] = useState({
    title: "",
    dueDate: "",
  })

  const [goalForm, setGoalForm] = useState({
    title: "",
  })

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Planning":
        return "bg-slate-100 text-slate-700 border-slate-200"
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Review":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
    }
  }

  const handleProjectUpdate = () => {
    const updatedProject = {
      ...project,
      ...projectForm,
    }
    onUpdate(updatedProject)
    setEditingProject(false)
  }

  const handleDeliverableSubmit = () => {
    if (editingDeliverable) {
      const updatedDeliverables = project.deliverables.map((d) =>
        d.id === editingDeliverable.id ? { ...d, title: deliverableForm.title, dueDate: deliverableForm.dueDate } : d,
      )
      onUpdate({ ...project, deliverables: updatedDeliverables })
      setEditingDeliverable(null)
    } else {
      const newDeliverable: Deliverable = {
        id: Date.now().toString(),
        title: deliverableForm.title,
        dueDate: deliverableForm.dueDate,
        status: "Pending",
      }
      onUpdate({ ...project, deliverables: [...project.deliverables, newDeliverable] })
    }
    setDeliverableForm({ title: "", dueDate: "" })
    setShowDeliverableForm(false)
  }

  const handleGoalSubmit = () => {
    if (editingGoal) {
      const updatedGoals = project.goals.map((g) => (g.id === editingGoal.id ? { ...g, title: goalForm.title } : g))
      onUpdate({ ...project, goals: updatedGoals })
      setEditingGoal(null)
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: goalForm.title,
        achieved: false,
      }
      onUpdate({ ...project, goals: [...project.goals, newGoal] })
    }
    setGoalForm({ title: "" })
    setShowGoalForm(false)
  }

  const toggleDeliverableStatus = (deliverableId: string) => {
    const updatedDeliverables = project.deliverables.map((d) =>
      d.id === deliverableId ? { ...d, status: d.status === "Complete" ? "Pending" : ("Complete" as const) } : d,
    )
    onUpdate({ ...project, deliverables: updatedDeliverables })
  }

  const toggleGoalAchievement = (goalId: string) => {
    const updatedGoals = project.goals.map((g) => (g.id === goalId ? { ...g, achieved: !g.achieved } : g))
    onUpdate({ ...project, goals: updatedGoals })
  }

  const deleteDeliverable = (deliverableId: string) => {
    const updatedDeliverables = project.deliverables.filter((d) => d.id !== deliverableId)
    onUpdate({ ...project, deliverables: updatedDeliverables })
  }

  const deleteGoal = (goalId: string) => {
    const updatedGoals = project.goals.filter((g) => g.id !== goalId)
    onUpdate({ ...project, goals: updatedGoals })
  }

  const startEditDeliverable = (deliverable: Deliverable) => {
    setEditingDeliverable(deliverable)
    setDeliverableForm({ title: deliverable.title, dueDate: deliverable.dueDate })
    setShowDeliverableForm(true)
  }

  const startEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalForm({ title: goal.title })
    setShowGoalForm(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 p-2 hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-light text-slate-900 mb-2">{project.name}</h1>
              <p className="text-slate-600">{project.client}</p>
            </div>
          </div>
          <Button
            onClick={() => setEditingProject(true)}
            variant="outline"
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Project
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium text-slate-900">Project Overview</CardTitle>
                  <Badge className={`${getStatusColor(project.status)} text-sm font-medium`}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                    <span className="text-sm text-slate-600">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium text-slate-900">Deliverables</CardTitle>
                  <Dialog open={showDeliverableForm} onOpenChange={setShowDeliverableForm}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Deliverable
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingDeliverable ? "Edit Deliverable" : "Add New Deliverable"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="deliverable-title">Title</Label>
                          <Input
                            id="deliverable-title"
                            value={deliverableForm.title}
                            onChange={(e) => setDeliverableForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter deliverable title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="deliverable-date">Due Date</Label>
                          <Input
                            id="deliverable-date"
                            type="date"
                            value={deliverableForm.dueDate}
                            onChange={(e) => setDeliverableForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowDeliverableForm(false)
                              setEditingDeliverable(null)
                              setDeliverableForm({ title: "", dueDate: "" })
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleDeliverableSubmit}>
                            {editingDeliverable ? "Update" : "Add"} Deliverable
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.deliverables.map((deliverable) => (
                    <div key={deliverable.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={deliverable.status === "Complete"}
                          onCheckedChange={() => toggleDeliverableStatus(deliverable.id)}
                        />
                        <div>
                          <p
                            className={`font-medium ${deliverable.status === "Complete" ? "line-through text-slate-500" : "text-slate-900"}`}
                          >
                            {deliverable.title}
                          </p>
                          <p className="text-sm text-slate-600">
                            Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => startEditDeliverable(deliverable)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteDeliverable(deliverable.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                  {project.deliverables.length === 0 && (
                    <p className="text-slate-500 text-center py-8">No deliverables added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium text-slate-900">Project Goals</CardTitle>
                  <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="goal-title">Goal</Label>
                          <Input
                            id="goal-title"
                            value={goalForm.title}
                            onChange={(e) => setGoalForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter project goal"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowGoalForm(false)
                              setEditingGoal(null)
                              setGoalForm({ title: "" })
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleGoalSubmit}>{editingGoal ? "Update" : "Add"} Goal</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.goals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox checked={goal.achieved} onCheckedChange={() => toggleGoalAchievement(goal.id)} />
                        <p
                          className={`font-medium ${goal.achieved ? "line-through text-slate-500" : "text-slate-900"}`}
                        >
                          {goal.title}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => startEditGoal(goal)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteGoal(goal.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                  {project.goals.length === 0 && (
                    <p className="text-slate-500 text-center py-8">No goals defined yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-900">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                    <span className="text-sm text-slate-600">Deliverables</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {project.deliverables.filter((d) => d.status === "Complete").length}/{project.deliverables.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm text-slate-600">Goals</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {project.goals.filter((g) => g.achieved).length}/{project.goals.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-amber-600" />
                    <span className="text-sm text-slate-600">Days Remaining</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {Math.max(
                      0,
                      Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Update Progress */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-900">Update Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="progress">Progress ({projectForm.progress}%)</Label>
                    <input
                      id="progress"
                      type="range"
                      min="0"
                      max="100"
                      value={projectForm.progress}
                      onChange={(e) =>
                        setProjectForm((prev) => ({ ...prev, progress: Number.parseInt(e.target.value) }))
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status-update">Status</Label>
                    <Select
                      value={projectForm.status}
                      onValueChange={(value) =>
                        setProjectForm((prev) => ({ ...prev, status: value as Project["status"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleProjectUpdate} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    Update Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Project Dialog */}
        <Dialog open={editingProject} onOpenChange={setEditingProject}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Project Name</Label>
                  <Input
                    id="edit-name"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-client">Client</Label>
                  <Input
                    id="edit-client"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, client: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start">Start Date</Label>
                  <Input
                    id="edit-start"
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end">End Date</Label>
                  <Input
                    id="edit-end"
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingProject(false)}>
                  Cancel
                </Button>
                <Button onClick={handleProjectUpdate}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
