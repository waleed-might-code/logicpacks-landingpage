import React from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-xl">!</span>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">Something went wrong</h1>
            <p className="text-neutral-500 text-sm mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <pre className="bg-[#111] border border-white/[0.06] rounded-lg p-4 text-left text-xs text-red-400 font-mono overflow-x-auto mb-6 max-h-40 overflow-y-auto">
              {this.state.error?.stack || 'No stack trace available.'}
            </pre>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex bg-white text-black font-semibold rounded-md px-6 py-2.5 text-sm hover:bg-neutral-200 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

