import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-4">
          <div className="bg-white p-6 rounded shadow-md max-w-lg w-full text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong while loading the app.</h1>
            <p className="mb-4">An unexpected error occurred.</p>
            {(import.meta as any).env.MODE !== 'production' && this.state.error && (
              <pre className="text-left bg-gray-100 p-4 rounded text-sm overflow-auto mb-4">
                {this.state.error.toString()}
              </pre>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
