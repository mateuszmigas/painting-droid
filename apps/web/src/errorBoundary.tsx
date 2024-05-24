import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    localStorage.clear();
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="p-big">Something went wrong. Reloading...</h1>;
    }

    return this.props.children;
  }
}

