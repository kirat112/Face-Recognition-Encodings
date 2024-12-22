
import React, { createContext, useContext } from 'react'

const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
  return <SidebarContext.Provider value={{}}>{children}</SidebarContext.Provider>
}

export const Sidebar = ({ children, className }) => (
  <aside className={`w-64 bg-white shadow-lg h-full ${className}`}>{children}</aside>
)

export const SidebarHeader = ({ children, className }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
)

export const SidebarContent = ({ children, className }) => (
  <div className={`flex flex-col space-y-2 ${className}`}>{children}</div>
)
