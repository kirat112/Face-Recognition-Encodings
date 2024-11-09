// components/ui/card.jsx

import React from 'react'

export const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children, className }) => (
  <div className={`p-4 border-b ${className}`}>
    {children}
  </div>
)

export const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-bold ${className}`}>{children}</h2>
)

export const CardDescription = ({ children, className }) => (
  <p className={`text-gray-500 ${className}`}>{children}</p>
)

export const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)
