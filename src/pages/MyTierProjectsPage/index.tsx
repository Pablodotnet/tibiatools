import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as firebase from '@/firebase/tierProjects';
import type { TierProject, TierProjectEntry } from '@/types/tierProject';
import { Trash2, Plus, ArrowLeft, Globe, Lock } from 'lucide-react';

const TIERS = Array.from({ length: 11 }, (_, i) => i);

const MyTierProjectsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`myTierProjects.${entry}`);

  const [projects, setProjects] = useState<TierProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<TierProject | null>(null);
  const [entries, setEntries] = useState<TierProjectEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(false);

  const [entryFrom, setEntryFrom] = useState('');
  const [entryTo, setEntryTo] = useState('');
  const [entryItems, setEntryItems] = useState('');
  const [entryCost, setEntryCost] = useState('');
  const [entryNotes, setEntryNotes] = useState('');

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await firebase.getUserProjects();
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const loadEntries = useCallback(async (projectId: string) => {
    try {
      setEntriesLoading(true);
      const data = await firebase.getProjectEntries(projectId);
      setEntries(data);
    } catch {
      toast.error('Failed to load entries');
    } finally {
      setEntriesLoading(false);
    }
  }, []);

  const handleCreateProject = async () => {
    if (!newName.trim() || !newTarget) {
      toast.error(translate('fillAllFields'));
      return;
    }
    try {
      await firebase.createProject({
        name: newName.trim(),
        targetTier: Number(newTarget),
        isPublic: newIsPublic,
      });
      toast.success(translate('projectCreated'));
      setNewName('');
      setNewTarget('');
      setNewIsPublic(false);
      await loadProjects();
    } catch {
      toast.error('Failed to create project');
    }
  };

  const handleToggleVisibility = async (project: TierProject) => {
    try {
      await firebase.updateProject(project.id, { isPublic: !project.isPublic });
      toast.success(translate('visibilityUpdated'));
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isPublic: !p.isPublic } : p)),
      );
      if (selectedProject?.id === project.id) {
        setSelectedProject((prev) => (prev ? { ...prev, isPublic: !prev.isPublic } : null));
      }
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await firebase.deleteProject(projectId);
      toast.success(translate('projectDeleted'));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setEntries([]);
      }
      await loadProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleSelectProject = async (project: TierProject) => {
    setSelectedProject(project);
    await loadEntries(project.id);
  };

  const handleAddEntry = async () => {
    if (!entryFrom || !entryTo || !entryItems.trim()) {
      toast.error(translate('fillAllFields'));
      return;
    }
    if (!selectedProject) return;
    try {
      await firebase.addEntry(selectedProject.id, {
        fromTier: Number(entryFrom),
        toTier: Number(entryTo),
        itemsUsed: entryItems.trim(),
        costGp: Number(entryCost) || 0,
        notes: entryNotes.trim(),
      });
      toast.success(translate('entryAdded'));
      setEntryFrom('');
      setEntryTo('');
      setEntryItems('');
      setEntryCost('');
      setEntryNotes('');
      await loadEntries(selectedProject.id);
    } catch {
      toast.error('Failed to add entry');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!selectedProject) return;
    try {
      await firebase.deleteEntry(selectedProject.id, entryId);
      toast.success(translate('entryDeleted'));
      await loadEntries(selectedProject.id);
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  if (loading) {
    return (
      <Card className='w-full max-w-2xl mx-auto mt-6'>
        <CardContent className='py-12 text-center text-muted-foreground'>
          {translate('loading')}
        </CardContent>
      </Card>
    );
  }

  if (selectedProject) {
    return (
      <div className='w-full max-w-2xl mx-auto mt-6 space-y-4'>
        <Button variant='ghost' onClick={() => { setSelectedProject(null); setEntries([]); }} className='gap-2'>
          <ArrowLeft className='size-4' />
          {translate('backToProjects')}
        </Button>

        <Card>
          <CardHeader>
              <div className='flex items-center justify-between'>
              <CardTitle>{selectedProject.name}</CardTitle>
              <Button variant='outline' size='sm' onClick={() => handleToggleVisibility(selectedProject)} className='gap-2'>
                {selectedProject.isPublic ? <Globe className='size-4' /> : <Lock className='size-4' />}
                {selectedProject.isPublic ? translate('public') : translate('private')}
              </Button>
            </div>
            <CardDescription>
              Target: Tier {selectedProject.targetTier} &middot; Current: Tier {selectedProject.currentTier}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>{translate('entries')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {entries.length === 0 && !entriesLoading && (
              <p className='text-muted-foreground text-center py-4 text-sm'>
                {translate('noEntries')}
              </p>
            )}
            {entries.map((entry) => (
              <div key={entry.id} className='flex items-start justify-between rounded-lg border p-3'>
                <div className='space-y-1 text-sm'>
                  <p className='font-medium'>
                    Tier {entry.fromTier} → Tier {entry.toTier}
                  </p>
                  <p className='text-muted-foreground'>{entry.itemsUsed}</p>
                  {entry.costGp > 0 && (
                    <p className='text-muted-foreground tabular-nums'>
                      {entry.costGp.toLocaleString()} gp
                    </p>
                  )}
                  {entry.notes && <p className='text-xs text-muted-foreground italic'>{entry.notes}</p>}
                </div>
                <Button variant='ghost' size='icon' onClick={() => handleDeleteEntry(entry.id)} aria-label='Delete entry'>
                  <Trash2 className='size-4 text-destructive' />
                </Button>
              </div>
            ))}
            {entriesLoading && (
              <p className='text-center text-sm text-muted-foreground py-2'>Loading entries...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>{translate('addEntry')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>{translate('fromTier')}</Label>
                <Select value={entryFrom} onValueChange={setEntryFrom}>
                  <SelectTrigger><SelectValue placeholder='0' /></SelectTrigger>
                  <SelectContent>
                    {TIERS.map((t) => <SelectItem key={t} value={String(t)}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>{translate('toTier')}</Label>
                <Select value={entryTo} onValueChange={setEntryTo}>
                  <SelectTrigger><SelectValue placeholder='1' /></SelectTrigger>
                  <SelectContent>
                    {TIERS.slice(1).map((t) => <SelectItem key={t} value={String(t)}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label>{translate('itemsUsed')}</Label>
              <Input placeholder='e.g. 2x Falcon Greaves' value={entryItems} onChange={(e) => setEntryItems(e.target.value)} />
            </div>
            <div className='space-y-2'>
              <Label>{translate('costGp')}</Label>
              <Input type='number' placeholder='0' value={entryCost} onChange={(e) => setEntryCost(e.target.value)} />
            </div>
            <div className='space-y-2'>
              <Label>{translate('notes')}</Label>
              <Input placeholder='Optional' value={entryNotes} onChange={(e) => setEntryNotes(e.target.value)} />
            </div>
            <Button onClick={handleAddEntry} className='gap-2'>
              <Plus className='size-4' />
              {translate('addEntry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='w-full max-w-2xl mx-auto mt-6 space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>{translate('title')}</CardTitle>
          <CardDescription>{translate('description')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4 rounded-lg border p-4'>
            <h3 className='font-semibold text-sm'>{translate('createNew')}</h3>
            <div className='space-y-2'>
              <Label>{translate('projectName')}</Label>
              <Input placeholder='e.g. Falcon Greaves' value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className='space-y-2'>
              <Label>{translate('targetTier')}</Label>
              <Input type='number' min={1} max={10} placeholder='e.g. 10' value={newTarget} onChange={(e) => setNewTarget(e.target.value)} />
            </div>
            <label className='flex items-center gap-2 text-sm'>
              <input type='checkbox' className='size-4 accent-blue-900' checked={newIsPublic} onChange={(e) => setNewIsPublic(e.target.checked)} />
              {translate('public')}
            </label>
            <Button onClick={handleCreateProject} className='gap-2'>
              <Plus className='size-4' />
              {translate('addProject')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {projects.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            {translate('noProjects')}
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {projects.map((project) => (
            <Card key={project.id} className='cursor-pointer hover:shadow-md transition-shadow' onClick={() => handleSelectProject(project)}>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>{project.name}</h4>
                    <p className='text-sm text-muted-foreground'>
                      Target: Tier {project.targetTier} &middot; Current: Tier {project.currentTier}
                    </p>
                  </div>
                  <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                    <Button variant='ghost' size='icon' onClick={() => handleToggleVisibility(project)} aria-label={project.isPublic ? translate('makePrivate') : translate('makePublic')}>
                      {project.isPublic ? <Globe className='size-4' /> : <Lock className='size-4' />}
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => handleDeleteProject(project.id)} aria-label='Delete project'>
                      <Trash2 className='size-4 text-destructive' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTierProjectsPage;
