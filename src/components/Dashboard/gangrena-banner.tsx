import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Swords } from 'lucide-react';

export function GangrenaBanner() {
  const { t } = useTranslation();
  const tw = (key: string) => t(`dashboard.${key}`);

  return (
    <Card className='overflow-hidden border-amber-500/30 dark:border-amber-500/20'>
      <a
        href='https://gangrenaot.com'
        target='_blank'
        rel='noopener noreferrer'
        className='block'
      >
        <CardContent className='p-0'>
          <div className='relative bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 dark:from-amber-950 dark:via-amber-900 dark:to-amber-800 p-5'>
            {/* Background decoration */}
            <div className='absolute inset-0 opacity-10'>
              <div className='absolute top-2 right-4 text-6xl font-black text-amber-500 select-none'>OT</div>
              <div className='absolute bottom-2 left-4 text-4xl font-black text-amber-500 select-none'><Swords className='size-8 text-amber-500' /></div>
            </div>

            <div className='relative flex items-start justify-between'>
              <div className='space-y-1'>
                <h2 className='text-base font-bold text-amber-50'>{tw('gangrenaTitle')}</h2>
                <p className='text-xs text-amber-200/80 max-w-xs leading-relaxed'>
                  {tw('gangrenaDesc')}
                </p>
                <div className='flex items-center gap-3 pt-1 text-[10px] text-amber-300/60'>
                  <span>{tw('gangrenaRate')}</span>
                  <span>&middot;</span>
                  <span>{tw('gangrenaVersion')}</span>
                </div>
              </div>
              <div className='flex items-center gap-1 text-amber-400 text-xs font-medium shrink-0 mt-1'>
                {tw('playNow')}
                <ExternalLink className='size-3' />
              </div>
            </div>
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
