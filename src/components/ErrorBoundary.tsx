import React from 'react';
import { Button } from '@/components/ui/button';
import i18n from '@/i18n';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h2 className="text-2xl font-bold text-destructive">{i18n.t('errorBoundary.somethingWentWrong')}</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {this.state.error?.message || i18n.t('errorBoundary.unexpectedError')}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            {i18n.t('errorBoundary.reloadPage')}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
