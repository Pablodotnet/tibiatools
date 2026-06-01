import { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  title?: string;
}

interface State {
  hasError: boolean;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            {this.props.title ?? 'Something went wrong'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
            }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
