import { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  title?: string;
  retryLabel?: string;
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
        <Alert variant="destructive" className="flex flex-col items-center justify-center gap-2 p-6 text-center [&>svg]:size-6 [&>svg]:static [&>svg]:translate-y-0">
          <AlertTriangle className="size-6" />
          <AlertTitle className="text-sm font-medium [&:not(:first-child)]:mt-0">{this.props.title ?? 'Something went wrong'}</AlertTitle>
          <AlertDescription className="[&:not(:first-child)]:mt-0">
            <button
              onClick={() => {
                this.setState({ hasError: false });
              }}
              className="inline-flex items-center gap-1 text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="size-3" />
              {this.props.retryLabel ?? 'Retry'}
            </button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
