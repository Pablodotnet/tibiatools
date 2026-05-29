import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  startFetchUserProjects,
  startCreateProject,
  startToggleVisibility,
  startDeleteProject,
  startSelectProject,
  startFetchEntries,
  startAddEntry,
  startDeleteEntry,
} from '@/store/tierProjects';
import type { TierProjectItem } from '@/types/tierProject';
import { Trash2, Plus, ArrowLeft, Globe, Lock, X } from 'lucide-react';

const TIERS = Array.from({ length: 11 }, (_, i) => i);

const MyTierProjectsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`myTierProjects.${entry}`);
  const dispatch = useAppDispatch();
  const { projects, selectedProjectId, entries, projectsLoading, entriesLoading } = useAppSelector((s) => s.tierProjects);
  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
  const currentEntries = selectedProjectId ? entries[selectedProjectId] ?? [] : [];

  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(false);

  const [entryFrom, setEntryFrom] = useState('');
  const [entryTo, setEntryTo] = useState('');
  const [entryNotes, setEntryNotes] = useState('');
  const [pendingItems, setPendingItems] = useState<TierProjectItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');

  useEffect(() => {
    dispatch(startFetchUserProjects());
  }, [dispatch]);

  const handleCreateProject = async () => {
    if (!newName.trim() || !newTarget) {
      toast.error(translate('fillAllFields'));
      return;
    }
    const result = await dispatch(startCreateProject({
      name: newName.trim(),
      targetTier: Number(newTarget),
      isPublic: newIsPublic,
    }));
    if (result.ok) {
      toast.success(translate('projectCreated'));
      setNewName('');
      setNewTarget('');
      setNewIsPublic(false);
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleVisibility = async () => {
    if (!selectedProject) return;
    const result = await dispatch(startToggleVisibility(selectedProject.id, !selectedProject.isPublic));
    if (result.ok) {
      toast.success(translate('visibilityUpdated'));
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const result = await dispatch(startDeleteProject(projectId));
    if (result.ok) {
      toast.success(translate('projectDeleted'));
    } else {
      toast.error(result.error);
    }
  };

  const handleSelectProject = async (projectId: string) => {
    dispatch(startSelectProject(projectId));
    try {
      await dispatch(startFetchEntries(projectId));
    } catch {
      toast.error('Failed to load entries');
    }
  };

  const handleBack = () => {
    dispatch(startSelectProject(null));
  };

  const handleAddItem = () => {
    if (!itemName.trim() || !itemCost) return;
    setPendingItems([...pendingItems, { name: itemName.trim(), costGp: Number(itemCost) }]);
    setItemName('');
    setItemCost('');
  };

  const handleRemoveItem = (index: number) => {
    setPendingItems(pendingItems.filter((_, i) => i !== index));
  };

  const handleSaveEntry = async () => {
    if (!entryFrom || !entryTo || pendingItems.length === 0) {
      toast.error(translate('fillAllFields'));
      return;
    }
    if (!selectedProject) return;
    const result = await dispatch(startAddEntry(selectedProject.id, {
      fromTier: Number(entryFrom),
      toTier: Number(entryTo),
      items: pendingItems,
      notes: entryNotes.trim(),
    }));
    if (result.ok) {
      toast.success(translate('entryAdded'));
      setEntryFrom('');
      setEntryTo('');
      setEntryNotes('');
      setPendingItems([]);
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!selectedProject) return;
    const result = await dispatch(startDeleteEntry(selectedProject.id, entryId));
    if (result.ok) {
      toast.success(translate('entryDeleted'));
    } else {
      toast.error(result.error);
    }
  };

  function entryTotalCost(entry: { items: TierProjectItem[] }): number {
    return entry.items.reduce((sum, i) => sum + i.costGp, 0);
  }

  const pendingTotal = pendingItems.reduce((sum, i) => sum + i.costGp, 0);

  if (projectsLoading) {
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
        <Button variant='ghost' onClick={handleBack} className='gap-2'>
          <ArrowLeft className='size-4' />
          {translate('backToProjects')}
        </Button>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>{selectedProject.name}</CardTitle>
              <Button variant='outline' size='sm' onClick={handleToggleVisibility} className='gap-2'>
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
            {currentEntries.length === 0 && !entriesLoading && (
              <p className='text-muted-foreground text-center py-4 text-sm'>
                {translate('noEntries')}
              </p>
            )}
            {currentEntries.map((entry) => (
              <div key={entry.id} className='rounded-lg border p-3'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1 text-sm'>
                    <p className='font-medium'>
                      Tier {entry.fromTier} → Tier {entry.toTier}
                    </p>
                    {entry.items.map((item, idx) => (
                      <p key={idx} className='text-muted-foreground'>
                        {item.name} — {item.costGp.toLocaleString()} gp
                      </p>
                    ))}
                    <p className='text-sm font-medium tabular-nums'>
                      Total: {entryTotalCost(entry).toLocaleString()} gp
                    </p>
                    {entry.notes && <p className='text-xs text-muted-foreground italic'>{entry.notes}</p>}
                  </div>
                  <Button variant='ghost' size='icon' onClick={() => handleDeleteEntry(entry.id)} aria-label='Delete entry'>
                    <Trash2 className='size-4 text-destructive' />
                  </Button>
                </div>
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
              <Label>{translate('items')}</Label>
              <div className='flex gap-2'>
                <Input placeholder='Item name' value={itemName} onChange={(e) => setItemName(e.target.value)} className='flex-1' />
                <Input type='number' placeholder='Cost (gp)' value={itemCost} onChange={(e) => setItemCost(e.target.value)} className='w-36' />
                <Button type='button' variant='outline' size='icon' onClick={handleAddItem} disabled={!itemName.trim() || !itemCost}>
                  <Plus className='size-4' />
                </Button>
              </div>
            </div>

            {pendingItems.length > 0 && (
              <div className='space-y-1.5 rounded-lg border p-3'>
                {pendingItems.map((item, idx) => (
                  <div key={idx} className='flex items-center justify-between text-sm'>
                    <span>
                      {item.name} — <span className='tabular-nums'>{item.costGp.toLocaleString()} gp</span>
                    </span>
                    <Button variant='ghost' size='icon' className='size-6' onClick={() => handleRemoveItem(idx)}>
                      <X className='size-3' />
                    </Button>
                  </div>
                ))}
                <div className='border-t pt-1.5 text-sm font-medium tabular-nums'>
                  Total: {pendingTotal.toLocaleString()} gp
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <Label>{translate('notes')}</Label>
              <Input placeholder='Optional' value={entryNotes} onChange={(e) => setEntryNotes(e.target.value)} />
            </div>
            <Button onClick={handleSaveEntry} className='gap-2' disabled={pendingItems.length === 0}>
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
            <Card key={project.id} className='cursor-pointer hover:shadow-md transition-shadow' onClick={() => handleSelectProject(project.id)}>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>{project.name}</h4>
                    <p className='text-sm text-muted-foreground'>
                      Target: Tier {project.targetTier} &middot; Current: Tier {project.currentTier}
                    </p>
                  </div>
                  <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
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
