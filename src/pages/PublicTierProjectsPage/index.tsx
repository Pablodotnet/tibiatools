import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import * as firebase from '@/firebase/tierProjects';
import type { TierProject } from '@/types/tierProject';
import { Globe } from 'lucide-react';

const PublicTierProjectsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`publicTierProjects.${entry}`);

  const [projects, setProjects] = useState<TierProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await firebase.getPublicProjects();
        setProjects(data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className='w-full max-w-2xl mx-auto mt-6'>
      <Card>
        <CardHeader>
          <CardTitle>{translate('title')}</CardTitle>
          <CardDescription>{translate('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='text-center text-muted-foreground py-8'>{translate('loading')}</p>
          ) : projects.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>{translate('empty')}</p>
          ) : (
            <div className='space-y-3'>
              {projects.map((project) => (
                <div key={project.id} className='rounded-lg border p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-semibold'>{project.name}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {translate('target')}: Tier {project.targetTier} &middot; {translate('current')}: Tier {project.currentTier}
                      </p>
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
