
import React from 'react'

export const Button = ({ variant = 'primary', className, children, ...props }) => {
  const baseStyles = "px-4 py-2 font-semibold rounded";
  const variantStyles = variant === 'ghost' 
    ? 'bg-transparent text-gray-700 hover:bg-gray-100' 
    : 'bg-blue-500 text-white hover:bg-blue-600';

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  )
}
