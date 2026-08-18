import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { message: string | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { message: null }

  static getDerivedStateFromError(error: unknown): State {
    return {
      message: error instanceof Error ? error.message : 'Something went wrong.',
    }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.message) return this.props.children
    return (
      <div className="gate">
        <div className="poster-frame gate-poster">
          <p className="poster-kicker">Department of Family Adventure</p>
          <h1 className="poster-title">Camp hitch</h1>
          <p className="gate-error">{this.state.message}</p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              this.setState({ message: null })
              window.location.reload()
            }}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}
