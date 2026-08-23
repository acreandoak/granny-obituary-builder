import { Component, type ReactNode, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'system-ui', padding: 32, maxWidth: 480 }}>
          <h1 style={{ fontSize: 18 }}>Something went wrong</h1>
          <p style={{ color: '#555' }}>{this.state.error.message}</p>
          <p style={{ color: '#555' }}>
            If this happened after pasting a large Freeform image, clear the broken save and reload:
          </p>
          <button
            type="button"
            style={{ marginRight: 8, padding: '8px 12px' }}
            onClick={() => {
              localStorage.removeItem('granny-obituary-builder:v8')
              localStorage.removeItem('granny-obituary-builder:v7')
              localStorage.removeItem('granny-obituary-builder:v6')
              localStorage.removeItem('granny-obituary-builder:v5')
              window.location.reload()
            }}
          >
            Clear save & reload
          </button>
          <button type="button" style={{ padding: '8px 12px' }} onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
