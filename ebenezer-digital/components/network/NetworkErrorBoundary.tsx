"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

/** Prevent one broken tool UI from crashing the whole page. */
export class NetworkErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    /* swallow — friendly UI below */
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="nx-panel">
            <p className="nx-error">Something went wrong with this tool. Please refresh and try again.</p>
            <button type="button" className="nx-btn nx-btn-ghost mt-3" onClick={() => this.setState({ hasError: false })}>
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
