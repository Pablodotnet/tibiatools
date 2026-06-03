import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentSessions } from '@/hooks/queries/useHuntSessions';

export function RecentSessionsWidget() {
  const { t } = useTranslation();
  const tw = (key: string) => t(`dashboard.${key}`);
  const { data: sessions, isLoading } = useRecentSessions(5);

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <Clock className='size-4 text-muted-foreground' />
          {tw('recentSessionsTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-2 py-2'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-3/4' />
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <p className='text-xs text-muted-foreground text-center py-4'>{tw('noRecentSessions')}</p>
        ) : (
          <div className='space-y-1.5'>
            {sessions.map((s) => (
              <div
                key={s.id}
                className='flex items-center justify-between rounded-md px-2.5 py-2 text-xs hover:bg-accent transition-colors'
              >
                <div className='min-w-0 flex-1'>
                  <p className='font-medium truncate'>{s.spotName}</p>
                  <p className='text-muted-foreground truncate'>
                    {s.vocation ?? '—'} &middot; {tw('level')} {s.level ?? '?'}
                  </p>
                </div>
                <div className='text-right shrink-0 ml-2'>
                  <p className={`tabular-nums ${(s.balance ?? 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {s.balance != null ? `${s.balance.toLocaleString()} gp` : '—'}
                  </p>
                  {s.xpPerHour != null && (
                    <p className='text-muted-foreground'>{s.xpPerHour.toLocaleString()} XP/h</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          to='/hunting-spots'
          className='mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
        >
          {tw('viewAllSpots')}
          <ArrowRight className='size-3' />
        </Link>
      </CardContent>
    </Card>
  );
}
