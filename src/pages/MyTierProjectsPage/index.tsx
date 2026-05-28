import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface TierProject {
  id: string;
  name: string;
  targetTier: number;
  currentTier: number;
}

const MyTierProjectsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`myTierProjects.${entry}`);
  const [projects, setProjects] = useState<TierProject[]>([]);
  const [projectName, setProjectName] = useState('');
  const [targetTier, setTargetTier] = useState('');

  const addProject = () => {
    if (!projectName.trim() || !targetTier) {
      toast.error('Please fill in all fields');
      return;
    }
    const newProject: TierProject = {
      id: crypto.randomUUID(),
      name: projectName.trim(),
      targetTier: Number(targetTier),
      currentTier: 0,
    };
    setProjects([...projects, newProject]);
    setProjectName('');
    setTargetTier('');
    toast.success('Project added');
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='projectName'>Project name</Label>
            <Input
              id='projectName'
              placeholder='e.g. Falcon Greaves'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='targetTier'>Target tier</Label>
            <Input
              id='targetTier'
              type='number'
              min={1}
              max={10}
              placeholder='e.g. 10'
              value={targetTier}
              onChange={(e) => setTargetTier(e.target.value)}
            />
          </div>
          <Button onClick={addProject} className='w-full'>
            Add project
          </Button>
        </div>

        {projects.length === 0 ? (
          <p className='text-muted-foreground text-center py-8'>
            No projects yet. Add one to get started.
          </p>
        ) : (
          <div className='space-y-3'>
            {projects.map((project) => (
              <Card key={project.id} className='p-4'>
                <h4 className='font-semibold'>{project.name}</h4>
                <p className='text-sm text-muted-foreground'>
                  Target: Tier {project.targetTier}
                </p>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyTierProjectsPage;
