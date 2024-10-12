// src/components/ui/Popover.tsx

import React from 'react'
import * as RadixPopover from '@radix-ui/react-popover'

interface PopoverProps {
  children: React.ReactNode
}

const Popover: React.FC<PopoverProps> = ({ children }) => {
  return <RadixPopover.Root>{children}</RadixPopover.Root>
}

const PopoverTrigger: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
}

const PopoverContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <RadixPopover.Content
      className={`bg-white p-4 rounded-md shadow-lg ${className}`}
      sideOffset={5}
    >
      {children}
      <RadixPopover.Arrow className="fill-white" />
    </RadixPopover.Content>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
