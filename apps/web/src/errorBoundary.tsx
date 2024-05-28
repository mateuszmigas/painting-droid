import { Component, type ReactNode } from "react";
import { isProduction } from "./utils/platform";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { error: string };

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error: error.message };
  }

  componentDidCatch(): void {
    if (isProduction()) {
      localStorage.clear();
      window.location.reload();
    }
  }

  render() {
    if (this.state.error) {
      return isProduction() ? (
        <h1 className="p-big">"Something went wrong. Reloading..."</h1>
      ) : (
        <h1 className="p-big text-destructive">
          App crashed: {this.state.error}
        </h1>
      );
    }

    return this.props.children;
  }
}

