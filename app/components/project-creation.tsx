"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, FileText, ImageIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProjectCreationProps {
  onSubmit: (project: {
    name: string
    details: string
    image: string
    generalNotes: string
  }) => void
  onCancel: () => void
}

export function ProjectCreation({ onSubmit, onCancel }: ProjectCreationProps) {
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    image: "/placeholder.svg?height=200&width=300",
    generalNotes: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onSubmit(formData)
    setIsGenerating(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onCancel} className="mr-4 p-2 hover:bg-white/50">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-light text-slate-900 mb-2">Create New Project</h1>
            <p className="text-slate-600">Provide project details and let AI generate your roadmap</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-light text-slate-900 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Project Name */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-medium text-slate-700">
                      Project Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your project name"
                      className="text-lg py-3 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                      required
                    />
                  </div>

                  {/* Project Details */}
                  <div className="space-y-3">
                    <Label htmlFor="details" className="text-base font-medium text-slate-700">
                      Project Details *
                    </Label>
                    <Textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) => setFormData((prev) => ({ ...prev, details: e.target.value }))}
                      placeholder="Describe your project's goals, scope, and key requirements. Be as detailed as possible - this helps our AI create a better roadmap."
                      className="min-h-[150px] border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                      required
                    />
                    <p className="text-sm text-slate-500">
                      💡 Tip: Include target audience, key features, timeline, and success criteria
                    </p>
                  </div>

                  {/* Project Image */}
                  <div className="space-y-3">
                    <Label htmlFor="image" className="text-base font-medium text-slate-700">
                      Project Image
                    </Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                      {formData.image !== "/placeholder.svg?height=200&width=300" ? (
                        <div className="space-y-4">
                          <img
                            src={formData.image || "/placeholder.svg"}
                            alt="Project preview"
                            className="w-full h-48 object-cover rounded-lg mx-auto"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, image: "/placeholder.svg?height=200&width=300" }))
                            }
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <ImageIcon className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-slate-600 mb-2">Upload a cover image or logo</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("image-upload")?.click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Image
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* General Notes */}
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-base font-medium text-slate-700">
                      General Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.generalNotes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, generalNotes: e.target.value }))}
                      placeholder="Add any initial thoughts, constraints, or high-level notes about the project"
                      className="min-h-[100px] border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      disabled={isGenerating}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isGenerating}
                      className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                    >
                      {isGenerating ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating Roadmap...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create Project & Generate Roadmap
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Features Preview */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-slate-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  AI-Powered Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">Smart Roadmap Generation</h4>
                    <p className="text-sm text-slate-600">
                      AI analyzes your project details to create a customized development roadmap
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">Intelligent Task Lists</h4>
                    <p className="text-sm text-slate-600">
                      Pre-populated checklists with best practices for each phase
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">Deliverable Templates</h4>
                    <p className="text-sm text-slate-600">Suggested outputs and templates for each project phase</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-slate-900">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    1
                  </div>
                  <span className="text-sm text-slate-600">AI analyzes your project details</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    2
                  </div>
                  <span className="text-sm text-slate-600">Generates a complete roadmap with phases</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    3
                  </div>
                  <span className="text-sm text-slate-600">Creates task lists and deliverable templates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    4
                  </div>
                  <span className="text-sm text-slate-600">You can customize and manage everything</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
