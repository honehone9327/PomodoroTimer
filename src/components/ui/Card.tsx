// src/components/ui/Card.tsx

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`px-4 py-2 border-b border-gray-200 ${className}`}>{children}</div>
}

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export { Card, CardHeader, CardContent }
