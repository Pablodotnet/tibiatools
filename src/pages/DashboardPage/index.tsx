import { useTranslation } from 'react-i18next';
import { HuntingSpotsWidget } from '@/components/Dashboard/hunting-spots-widget';
import { GangrenaBanner } from '@/components/Dashboard/gangrena-banner';
import { TierProjectsWidget } from '@/components/Dashboard/tier-projects-widget';
import { QuickToolsWidget } from '@/components/Dashboard/quick-tools-widget';

export default function DashboardPage() {
  const { t } = useTranslation();
  const tw = (key: string) => t(`dashboard.${key}`);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl font-bold'>{tw('welcome')}</h1>
        <p className='text-sm text-muted-foreground mt-1'>{tw('welcomeDesc')}</p>
      </div>

      <GangrenaBanner />

      <div className='grid gap-4 md:grid-cols-2'>
        <HuntingSpotsWidget />
        <QuickToolsWidget />
      </div>

      <TierProjectsWidget />
    </div>
  );
}
