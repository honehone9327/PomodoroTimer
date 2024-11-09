// src/components/ui/Avatar.tsx

import React from 'react'
import * as RadixAvatar from '@radix-ui/react-avatar'

interface AvatarProps {
  children: React.ReactNode
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ children, className = '', ...props }) => {
  return (
    <RadixAvatar.Root className={`flex items-center justify-center overflow-hidden rounded-full ${className}`} {...props}>
      {children}
    </RadixAvatar.Root>
  )
}

const AvatarImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return <RadixAvatar.Image className="w-full h-full object-cover" src={src} alt={alt} />
}

const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <RadixAvatar.Fallback className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">{children}</RadixAvatar.Fallback>
}

export { Avatar, AvatarImage, AvatarFallback }
