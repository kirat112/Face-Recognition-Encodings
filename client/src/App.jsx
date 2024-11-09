// main component file
'use client'

import React, { useState } from 'react'
// Remove the 'next/image' import
import { Button } from "./components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card.jsx"
import { Input } from "./components/ui/input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table.jsx"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "./components/ui/sidebar.jsx"
import { Upload, User, Home, BarChart, Settings, LogOut } from "lucide-react"

export default function DashboardPage() {
  const [imagePreview, setImagePreview] = useState(null)
  const [playerName, setPlayerName] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setPlayerName("Lionel Messi")
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-6 py-4">
              <img src="/placeholder.svg" alt="Logo" width={32} height={32} /> {/* Updated here */}
              <span className="text-xl font-bold">Play-ID-vision</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-2 px-4">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                Statistics
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-8">Player Recognition Dashboard</h1>
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Player Image</CardTitle>
                <CardDescription>Upload an image to recognize the player and fetch their statistics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Uploaded player" width={200} height={200} className="rounded-lg object-cover" /> 
                  ) : (
                    <div className="w-[200px] h-[200px] bg-muted flex items-center justify-center rounded-lg">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept="image/*"
                    id="player-image"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('player-image').click()}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Select Image
                  </Button>
                  <Button type="button">Recognize Player</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{playerName || "Player Statistics"}</CardTitle>
                <CardDescription>View the recognized player's statistics</CardDescription>
              </CardHeader>
              <CardContent>
                {playerName ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Statistic</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Goals</TableCell>
                        <TableCell>672</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Assists</TableCell>
                        <TableCell>303</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Appearances</TableCell>
                        <TableCell>778</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Upload and recognize a player to view their statistics.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
