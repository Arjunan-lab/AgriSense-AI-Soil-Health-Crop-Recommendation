import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 border border-rose-100 dark:border-rose-950/30 rounded-card bg-rose-50/15 dark:bg-rose-950/10 shadow-soft max-w-xl mx-auto my-8">
          <div className="p-4 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full mb-4">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
            {this.props.fallbackTitle || 'Analysis Rendering Error'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-6">
            {this.state.error?.message || this.props.fallbackMessage || 'An unexpected rendering error occurred. Please try again.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
