import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  error: Error | null;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[Dashboard ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
          <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-lg font-bold text-red-700">Dashboard Error</p>
            <p className="mt-2 break-words text-sm text-red-600">{this.state.error.message}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
            <p className="mt-3 text-xs text-red-500">Check browser console for details</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
