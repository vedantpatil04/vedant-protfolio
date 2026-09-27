import type { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: ReactNode
  trigger?: ReactNode
}

export function Modal({ open, onOpenChange, title, description, children, trigger }: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]',
            'data-[state=open]:[animation:overlay-in_var(--duration-base)_var(--ease-standard)]',
            'data-[state=closed]:[animation:overlay-out_var(--duration-fast)_var(--ease-standard)]',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2',
            'rounded-lg border border-border bg-surface p-6 shadow-lg',
            'data-[state=open]:[animation:dialog-in_var(--duration-base)_var(--ease-out-expo)]',
            'data-[state=closed]:[animation:dialog-out_var(--duration-fast)_var(--ease-standard)]',
            'focus:outline-none',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <DialogPrimitive.Title className="text-h3 text-text">{title}</DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-body-sm text-text-secondary">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              className="-m-1.5 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text"
              aria-label="Close dialog"
            >
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          {children && <div className="mt-4">{children}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
