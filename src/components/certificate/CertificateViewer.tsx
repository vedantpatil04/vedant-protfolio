import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CertificateViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string
  title: string
}

/**
 * Enlarged certificate view — reuses the same @radix-ui/react-dialog
 * primitive as the shared Modal component (focus trap + Escape-to-close
 * + scroll lock come for free from Radix) but sized for a document
 * image instead of a small confirm dialog. The document is shown as-is:
 * no filters, no cropping. Opens with the shared dialog motion.
 */
export function CertificateViewer({ open, onOpenChange, imageUrl, title }: CertificateViewerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-overlay backdrop-blur-[3px]',
            'data-[state=open]:[animation:overlay-in_var(--duration-base)_var(--ease-standard)]',
            'data-[state=closed]:[animation:overlay-out_var(--duration-fast)_var(--ease-standard)]',
          )}
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[92dvh] w-[94vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl focus:outline-none',
            'data-[state=open]:[animation:dialog-in_var(--duration-medium)_var(--ease-out-expo)]',
            'data-[state=closed]:[animation:dialog-out_var(--duration-fast)_var(--ease-standard)]',
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-border py-2 pl-5 pr-2">
            <DialogPrimitive.Title className="truncate text-body-sm font-medium text-text">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
              aria-label="Close certificate viewer"
            >
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-surface-2 p-3 sm:p-8">
            <img
              src={imageUrl}
              alt={`${title} — full certificate`}
              className="max-h-[calc(92dvh-6rem)] w-auto max-w-full object-contain"
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
