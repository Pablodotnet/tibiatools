import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import i18n from '@/i18n';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4'>
          <h2 className='text-2xl font-bold text-destructive text-center'>{i18n.t('errorBoundary.somethingWentWrong')}</h2>
          <p className='text-muted-foreground text-center max-w-md text-sm'>
            {this.state.error?.message || i18n.t('errorBoundary.unexpectedError')}
          </p>
          <div className='flex gap-3'>
            <Button onClick={() => window.location.reload()}>
              {i18n.t('errorBoundary.reloadPage')}
            </Button>
            <Button variant='outline' onClick={() => this.setState({ hasError: false, error: null })}>
              {i18n.t('errorBoundary.tryAgain')}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return <RouteErrorBoundary key={location.pathname}>{children}</RouteErrorBoundary>;
}
