import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, ArrowRight } from 'lucide-react';
import { startFetchPublicProjects } from '@/store/tierProjects';
import { useAppDispatch, useAppSelector } from '@/hooks';
import type { TierProject } from '@/types/tierProject';
import { Skeleton } from '@/components/ui/skeleton';

export function TierProjectsWidget() {
  const { t } = useTranslation();
  const tw = (key: string) => t(`dashboard.${key}`);
  const dispatch = useAppDispatch();
  const { projects, projectsLoading } = useAppSelector((s) => s.tierProjects);

  useEffect(() => {
    dispatch(startFetchPublicProjects());
  }, [dispatch]);

  const displayed = projects.slice(0, 4);

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle asChild><h2 className='text-sm font-medium flex items-center gap-2'>
          <FolderKanban className='size-4 text-muted-foreground' />
          {tw('tierProjectsTitle')}
        </h2></CardTitle>
      </CardHeader>
      <CardContent>
        {projectsLoading ? (
          <div className='space-y-2 py-2'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-3/4' />
          </div>
        ) : displayed.length === 0 ? (
          <p className='text-xs text-muted-foreground text-center py-4'>{tw('noProjects')}</p>
        ) : (
          <div className='space-y-1.5'>
            {displayed.map((p: TierProject) => (
              <Link
                key={p.id}
                to={`/public-projects/${p.id}`}
                className='flex items-center justify-between rounded-md px-2.5 py-2 text-xs hover:bg-accent transition-colors focus-visible:outline-2 focus-visible:outline-ring'
              >
                <div className='min-w-0 flex-1'>
                  <p className='font-medium truncate'>{p.name}</p>
                  <p className='text-muted-foreground truncate'>{p.ownerDisplayName}</p>
                </div>
                <span className='text-muted-foreground shrink-0 ml-2'>
                  T{p.targetTier}
                </span>
              </Link>
            ))}
          </div>
        )}
        <Link
          to='/public-projects'
          className='mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring'
        >
          {tw('viewAllProjects')}
          <ArrowRight className='size-3' />
        </Link>
      </CardContent>
    </Card>
  );
}
