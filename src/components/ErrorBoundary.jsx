import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error) {
    console.error('Application error boundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f6f3ec] p-6 text-slate-900">
          <div className="mx-auto max-w-2xl rounded-[28px] border border-rose-200 bg-white p-8 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Application error</p>
            <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Something broke while rendering the app.</h1>
            <p className="mt-3 text-sm text-slate-600">Refresh the page. If the error keeps coming back, check the browser console and the current route for the failing component.</p>
            {this.state.error ? <pre className="mt-4 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">{String(this.state.error.message || this.state.error)}</pre> : null}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}