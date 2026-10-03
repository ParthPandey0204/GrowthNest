import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled rendering error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><section className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1><p className="mt-3 text-sm leading-6 text-slate-600">We could not render this page. Please reload and try again.</p><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#1D546C] px-4 py-2 text-sm font-semibold text-white">Reload page</button></section></main>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
