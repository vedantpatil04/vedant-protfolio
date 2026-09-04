import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

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
 * image instead of a small confirm dialog.
 */
export function CertificateViewer({ open, onOpenChange, imageUrl, title }: CertificateViewerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[2px]" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[92vh] w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-surface focus:outline-none">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
            <DialogPrimitive.Title className="truncate text-body-sm font-medium text-text">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="shrink-0 rounded-sm p-1.5 text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
              aria-label="Close certificate viewer"
            >
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-auto bg-surface-2 p-4 sm:p-8">
            <img
              src={imageUrl}
              alt={`${title} — full certificate`}
              className="mx-auto max-h-full w-auto max-w-full object-contain"
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
