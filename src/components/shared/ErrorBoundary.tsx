import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12 text-center">
          <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-8 shadow-sm">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-surface-2 text-accent border border-border">
              <AlertTriangle className="size-6" aria-hidden="true" />
            </div>
            <h1 className="font-display text-h3 text-text mb-2">Something went wrong</h1>
            <p className="text-body-sm text-text-secondary mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <Button onClick={this.handleReset} variant="primary" className="w-full">
              <RefreshCw className="size-4" aria-hidden="true" />
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
