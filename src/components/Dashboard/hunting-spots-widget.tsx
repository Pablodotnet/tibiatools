import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crosshair, ChevronRight } from 'lucide-react';
import { vocations } from '@/helpers';
import { huntingSpotsByVocation } from '@/helpers/huntingSpots';

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
          {vocations.map((v) => {
            const count = huntingSpotsByVocation[v.id]?.length ?? 0;
            return (
              <Link
                key={v.id}
                to={`/hunting-spots/${v.id}`}
                className='flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring'
              >
                <img src={v.icon} alt={v.name} className='size-5 shrink-0' />
                <span className='flex-1 truncate'>{v.name}</span>
                {count > 0 && (
                  <Badge className='text-[10px] bg-muted px-1.5 py-0.5 tabular-nums rounded-sm'>
                    {count}
                  </Badge>
                )}
              </Link>
            );
          })}
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
