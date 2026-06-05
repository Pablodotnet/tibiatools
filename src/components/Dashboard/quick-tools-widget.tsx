import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Gauge, Trophy, Sword } from 'lucide-react';

const LINKS = [
  { to: '/imbuings', labelKey: 'imbuings', icon: Zap, descKey: 'imbuingsDesc' },
  { to: '/level-calculator', labelKey: 'levelCalculator', icon: Gauge, descKey: 'levelCalcDesc' },
  { to: '/exercise-weapons', labelKey: 'exerciseWeapons', icon: Sword, descKey: 'exerciseDesc' },
  { to: '/bless-calculator', labelKey: 'blessCalculator', icon: Trophy, descKey: 'blessDesc' },
];

export function QuickToolsWidget() {
  const { t } = useTranslation();
  const tw = (key: string) => t(`dashboard.${key}`);

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle asChild><h2 className='text-sm font-medium flex items-center gap-2'>
          <Gauge className='size-4 text-muted-foreground' />
          {tw('quickToolsTitle')}
        </h2></CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-2'>
          {LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className='flex flex-col items-center gap-1 rounded-md border px-3 py-3 text-center hover:bg-accent transition-colors focus-visible:outline-2 focus-visible:outline-ring'
              >
                <Icon className='size-5 text-muted-foreground' />
                <span className='text-xs font-medium'>{tw(item.labelKey)}</span>
                <span className='text-[10px] text-muted-foreground leading-tight'>
                  {tw(item.descKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
