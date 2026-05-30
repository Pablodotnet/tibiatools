import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { startFetchPublicProjects } from '@/store/tierProjects';
import { ArrowLeft, Globe } from 'lucide-react';
import { getProjectEntries } from '@/firebase/tierProjects';
import type { TierProject, TierProjectEntry } from '@/types/tierProject';

const PublicTierProjectsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`publicTierProjects.${entry}`);
  const dispatch = useAppDispatch();
  const { projects, projectsLoading } = useAppSelector((s) => s.tierProjects);

  const [selectedProject, setSelectedProject] = useState<TierProject | null>(null);
  const [entries, setEntries] = useState<TierProjectEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  useEffect(() => {
    dispatch(startFetchPublicProjects());
  }, [dispatch]);

  const handleSelectProject = async (project: TierProject) => {
    setSelectedProject(project);
    setEntriesLoading(true);
    try {
      const data = await getProjectEntries(project.id);
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setEntriesLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedProject(null);
    setEntries([]);
  };

  if (selectedProject) {
    return (
      <div className='w-full max-w-2xl mx-auto mt-6 space-y-4'>
        <Button variant='ghost' onClick={handleBack} className='gap-2'>
          <ArrowLeft className='size-4' />
          {translate('backToProjects')}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{selectedProject.name}</CardTitle>
            <CardDescription>
              {translate('target')}: Tier {selectedProject.targetTier} &middot; {translate('current')}: Tier {selectedProject.currentTier} &middot; {translate('by')} {selectedProject.ownerDisplayName}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>{translate('entries')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {entriesLoading ? (
              <p className='text-center text-sm text-muted-foreground py-4'>{translate('loading')}</p>
            ) : entries.length === 0 ? (
              <p className='text-muted-foreground text-center py-4 text-sm'>{translate('noEntries')}</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className='rounded-lg border p-3'>
                  <div className='space-y-1 text-sm'>
                    <p className='font-medium'>
                      Tier {entry.fromTier} → Tier {entry.toTier}
                    </p>
                    {entry.method && (
                      <p className='text-xs text-muted-foreground'>
                        {entry.classification ? `${translate('entries')} ${entry.classification}` : ''}
                      </p>
                    )}
                    {entry.items.map((item, idx) => (
                      <p key={idx} className='text-muted-foreground'>
                        {item.name} — {item.costGp.toLocaleString()} gp
                      </p>
                    ))}
                    <p className='text-sm font-medium tabular-nums'>
                      {translate('total')}: {entry.items.reduce((sum, i) => sum + i.costGp, 0).toLocaleString()} gp
                    </p>
                    {entry.notes && <p className='text-xs text-muted-foreground italic'>{entry.notes}</p>}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='w-full max-w-2xl mx-auto mt-6'>
      <Card>
        <CardHeader>
          <CardTitle>{translate('title')}</CardTitle>
          <CardDescription>{translate('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <p className='text-center text-muted-foreground py-8'>{translate('loading')}</p>
          ) : projects.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>{translate('empty')}</p>
          ) : (
            <div className='space-y-3'>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className='rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => handleSelectProject(project)}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-semibold'>{project.name}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {translate('target')}: Tier {project.targetTier} &middot; {translate('current')}: Tier {project.currentTier}
                      </p>
                      {project.totalSpentGp > 0 && (
                        <p className='text-xs text-muted-foreground tabular-nums mt-0.5'>
                          Total spent: {project.totalSpentGp.toLocaleString()} gp
                        </p>
                      )}
                    </div>
                    <Globe className='size-4 text-muted-foreground shrink-0' />
                  </div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    {translate('by')} {project.ownerDisplayName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicTierProjectsPage;
