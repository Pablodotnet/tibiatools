import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crosshair, ChevronRight } from 'lucide-react';
import { vocations } from '@/helpers';

export function HuntingSpotsWidget() {
  const { t } = useTranslation();
  const tw = (key: string) => t(`dashboard.${key}`);

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <Crosshair className='size-4 text-muted-foreground' />
          {tw('huntingSpotsTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-2'>
          {vocations.map((v) => (
            <Link
              key={v.id}
              to={`/hunting-spots/${v.id}`}
              className='flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
            >
              <img src={v.icon} alt={v.name} className='size-5' />
              <span>{v.name}</span>
            </Link>
          ))}
        </div>
        <Link
          to='/hunting-spots'
          className='mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
        >
          {tw('viewAllSpots')}
          <ChevronRight className='size-3' />
        </Link>
      </CardContent>
    </Card>
  );
}
