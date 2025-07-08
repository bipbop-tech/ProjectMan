"use client"

import { useState } from "react"
import { ArrowLeft, UserPlus, Mail, Crown, Shield, Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Project, User, TeamMember } from "../types/project-atlas"

interface TeamManagementProps {
  project: Project
  currentUser: User
  onBack: () => void
  onUpdate: (project: Project) => void
}

export function TeamManagement({ project, currentUser, onBack, onUpdate }: TeamManagementProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteForm, setInviteForm] = useState({ email: "", role: "editor" as TeamMember["role"] })

  const getRoleIcon = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-amber-600" />
      case "admin":
        return <Shield className="w-4 h-4 text-blue-600" />
      case "editor":
        return <Edit className="w-4 h-4 text-green-600" />
      case "viewer":
        return <Eye className="w-4 h-4 text-slate-600" />
    }
  }

  const getRoleColor = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "editor":
        return "bg-green-100 text-green-700 border-green-200"
      case "viewer":
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const handleInviteMember = () => {
    // Simulate sending invitation
    const newMember: TeamMember = {
      id: Date.now().toString(),
      user: {
        id: Date.now().toString(),
        name: inviteForm.email.split("@")[0],
        email: inviteForm.email,
        avatar: "/placeholder.svg?height=40&width=40",
        role: "user",
        createdAt: new Date().toISOString(),
      },
      role: inviteForm.role,
      joinedAt: new Date().toISOString(),
    }

    const updatedProject = {
      ...project,
      teamMembers: [...project.teamMembers, newMember],
    }

    onUpdate(updatedProject)
    setInviteForm({ email: "", role: "editor" })
    setShowInviteDialog(false)
  }

  const handleRemoveMember = (memberId: string) => {
    const updatedProject = {
      ...project,
      teamMembers: project.teamMembers.filter((member) => member.id !== memberId),
    }
    onUpdate(updatedProject)
  }

  const handleUpdateRole = (memberId: string, newRole: TeamMember["role"]) => {
    const updatedProject = {
      ...project,
      teamMembers: project.teamMembers.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member,
      ),
    }
    onUpdate(updatedProject)
  }

  const canManageTeam =
    currentUser.id === project.owner.id ||
    project.teamMembers.find((m) => m.user.id === currentUser.id)?.role === "admin"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 p-2 hover:bg-white/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.name}
                className="w-12 h-12 rounded-lg object-cover shadow-sm"
              />
              <div>
                <h1 className="text-3xl font-light text-slate-900 mb-1">{project.name}</h1>
                <p className="text-slate-600">Team Management</p>
              </div>
            </div>
          </div>
          {canManageTeam && (
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invite-email">Email Address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite-role">Role</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value) =>
                        setInviteForm((prev) => ({ ...prev, role: value as TeamMember["role"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer - Can view project</SelectItem>
                        <SelectItem value="editor">Editor - Can edit tasks and deliverables</SelectItem>
                        <SelectItem value="admin">Admin - Can manage team and settings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInviteMember} disabled={!inviteForm.email}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Team Members */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-slate-900">
              Team Members ({project.teamMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.user.avatar || "/placeholder.svg"} alt={member.user.name} />
                      <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-slate-900">{member.user.name}</h3>
                        {member.user.id === project.owner.id && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Owner</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{member.user.email}</p>
                      <p className="text-xs text-slate-500">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className={`${getRoleColor(member.role)} text-sm font-medium flex items-center space-x-1`}>
                      {getRoleIcon(member.role)}
                      <span className="capitalize">{member.role}</span>
                    </Badge>

                    {canManageTeam && member.user.id !== project.owner.id && member.user.id !== currentUser.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "viewer")}>
                            Change to Viewer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "editor")}>
                            Change to Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "admin")}>
                            Change to Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove from project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-slate-900">Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Crown className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-900">Owner</h4>
                    <p className="text-sm text-slate-600">
                      Full control over the project including deletion, team management, and all settings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-900">Admin</h4>
                    <p className="text-sm text-slate-600">
                      Can manage team members, edit project settings, and perform all editing functions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Edit className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-900">Editor</h4>
                    <p className="text-sm text-slate-600">
                      Can update tasks, add deliverables, upload files, and leave comments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-slate-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-900">Viewer</h4>
                    <p className="text-sm text-slate-600">
                      Read-only access to view project progress and deliverables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
