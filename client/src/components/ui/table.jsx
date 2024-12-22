
import React from 'react'

export const Table = ({ children, className }) => (
  <table className={`min-w-full border ${className}`}>
    {children}
  </table>
)

export const TableHeader = ({ children, className }) => (
  <thead className={`bg-gray-100 ${className}`}>
    {children}
  </thead>
)

export const TableBody = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
)

export const TableRow = ({ children, className }) => (
  <tr className={`border-b ${className}`}>{children}</tr>
)

export const TableHead = ({ children, className }) => (
  <th className={`p-2 text-left font-semibold ${className}`}>{children}</th>
)

export const TableCell = ({ children, className }) => (
  <td className={`p-2 ${className}`}>{children}</td>
)
