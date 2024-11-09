// components/ui/input.jsx

import React from 'react'

export const Input = ({ className, ...props }) => (
  <input
    className={`border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
)
