import type { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  side?: 'left' | 'right'
  children?: ReactNode
}

/** Slide-in panel — used by the mobile navigation menu and future side panels. */
export function Drawer({ open, onOpenChange, title, side = 'right', children }: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-y-0 z-50 flex w-[86vw] max-w-sm flex-col border-border bg-surface p-6',
            'focus:outline-none',
            side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          )}
        >
          <div className="flex items-center justify-between">
            {title ? (
              <DialogPrimitive.Title className="text-h3 text-text">{title}</DialogPrimitive.Title>
            ) : (
              <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>
            )}
            <DialogPrimitive.Close
              className="rounded-sm p-1 text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text"
              aria-label="Close menu"
            >
              <X className="size-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <div className="mt-6 flex flex-1 flex-col overflow-y-auto">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
