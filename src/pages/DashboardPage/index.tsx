import { useTranslation } from 'react-i18next';
import { HuntingSpotsWidget } from '@/components/Dashboard/hunting-spots-widget';
import { GangrenaBanner } from '@/components/Dashboard/gangrena-banner';
import { TierProjectsWidget } from '@/components/Dashboard/tier-projects-widget';
import { QuickToolsWidget } from '@/components/Dashboard/quick-tools-widget';
import { RecentSessionsWidget } from '@/components/Dashboard/recent-sessions-widget';
import { WidgetErrorBoundary } from '@/components/ui/widget-error-boundary';

export default function DashboardPage() {
  const { t } = useTranslation();
  const tw = (key: string) => t(`dashboard.${key}`);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl font-bold font-heading'>{tw('welcome')}</h1>
        <p className='text-sm text-muted-foreground mt-1'>{tw('welcomeDesc')}</p>
      </div>

      <GangrenaBanner />

      <div className='grid gap-4 md:grid-cols-2'>
        <WidgetErrorBoundary title={tw('huntingSpotsTitle')} retryLabel={tw('retry')}>
          <HuntingSpotsWidget />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary title={tw('quickToolsTitle')} retryLabel={tw('retry')}>
          <QuickToolsWidget />
        </WidgetErrorBoundary>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <WidgetErrorBoundary title={tw('tierProjectsTitle')} retryLabel={tw('retry')}>
          <TierProjectsWidget />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary title={tw('recentSessionsTitle')} retryLabel={tw('retry')}>
          <RecentSessionsWidget />
        </WidgetErrorBoundary>
      </div>
    </div>
  );
}
