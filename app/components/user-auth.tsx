"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Sparkles } from "lucide-react"
import type { User } from "../types/project-atlas"

interface UserAuthProps {
  onLogin: (user: User) => void
}

export function UserAuth({ onLogin }: UserAuthProps) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate authentication
    const user: User = {
      id: "user-1",
      name: "John Doe",
      email: loginForm.email,
      avatar: "/placeholder.svg?height=40&width=40",
      role: "admin",
      createdAt: new Date().toISOString(),
    }
    onLogin(user)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate user creation
    const user: User = {
      id: Date.now().toString(),
      name: signupForm.name,
      email: signupForm.email,
      avatar: "/placeholder.svg?height=40&width=40",
      role: "user",
      createdAt: new Date().toISOString(),
    }
    onLogin(user)
  }

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: "demo-user",
      name: "Demo User",
      email: "demo@projectatlas.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "admin",
      createdAt: new Date().toISOString(),
    }
    onLogin(demoUser)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Atlas</h1>
          <p className="text-slate-600">AI-powered project management and roadmap generation</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try Demo Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-slate-500">
          <p>AI-powered roadmaps • Team collaboration • Progress tracking</p>
        </div>
      </div>
    </div>
  )
}
