// src/components/ui/Dialog.tsx

import React from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  )
}

const DialogTrigger: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>
}

const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
      <RadixDialog.Content
        className={`fixed top-1/2 left-1/2 max-w-lg w-full bg-white rounded-lg p-6 transform -translate-x-1/2 -translate-y-1/2 shadow-lg ${className}`}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <RadixDialog.Title className="text-xl font-semibold text-gray-900">{children}</RadixDialog.Title>
}

const DialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <RadixDialog.Description className="text-gray-700 mb-4">{children}</RadixDialog.Description>
}

const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`mt-4 flex justify-end space-x-2 ${className}`}>{children}</div>
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
