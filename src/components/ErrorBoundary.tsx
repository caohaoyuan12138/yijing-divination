import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="panel text-center py-6">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-sm text-text-muted mb-3">页面出现异常</div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-lg text-xs text-gold hover:bg-gold/20"
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}