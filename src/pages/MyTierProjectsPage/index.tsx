import { useState, useEffect, useMemo } from 'react';
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
  startUpdateEntry,
  startDeleteEntry,
} from '@/store/tierProjects';
import type { TierProjectItem, TierProjectEntry } from '@/types/tierProject';
import { Trash2, Plus, ArrowLeft, Globe, Lock, X, Coins, Pencil } from 'lucide-react';
import {
  FUSION_GOLD_GP,
  TRANSFER_GOLD_GP,
  TRANSFER_CORES,
  CONVERGENCE_FUSION_GOLD_GP,
  CONVERGENCE_TRANSFER_GOLD_GP,
  CONVERGENCE_TRANSFER_CORES,
  formatGp,
} from '@/helpers/exaltationForge';

const TIERS = Array.from({ length: 11 }, (_, i) => i);

const METHODS = ['fusion', 'transfer', 'convergenceFusion', 'convergenceTransfer'] as const;
const CLASSIFICATIONS = [1, 2, 3, 4] as const;

function computeMethodCost(
  method: string,
  classification: number,
  fromTier: number,
  toTier: number,
): number | null {
  try {
    switch (method) {
      case 'fusion': {
        const cls = classification as 1 | 2 | 3 | 4;
        let total = 0;
        for (let t = fromTier; t < toTier; t++) {
          const cost = FUSION_GOLD_GP[cls][t];
          if (cost === null) return null;
          total += cost;
        }
        return total;
      }
      case 'transfer': {
        const cls = classification as 1 | 2 | 3 | 4;
        if (fromTier < 2) return null;
        const cost = TRANSFER_GOLD_GP[cls][fromTier - 1];
        return cost ?? null;
      }
      case 'convergenceFusion': {
        let total = 0;
        for (let t = fromTier; t < toTier; t++) {
          const cost = CONVERGENCE_FUSION_GOLD_GP[t];
          if (cost === null) return null;
          total += cost;
        }
        return total;
      }
      case 'convergenceTransfer': {
        const cls = classification as 3 | 4;
        if (cls !== 4 || toTier < 1) return null;
        const cost = CONVERGENCE_TRANSFER_GOLD_GP[cls][toTier - 1];
        return cost ?? null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

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
  const [entryMethod, setEntryMethod] = useState('');
  const [entryClassification, setEntryClassification] = useState('4');
  const [entryNotes, setEntryNotes] = useState('');
  const [pendingItems, setPendingItems] = useState<TierProjectItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [itemMarketPrice, setItemMarketPrice] = useState('');
  const [entryCores, setEntryCores] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const estimatedCost = useMemo(() => {
    if (!entryFrom || !entryTo || !entryMethod || !entryClassification) return null;
    const from = Number(entryFrom);
    const to = Number(entryTo);
    const cls = Number(entryClassification);
    if (from >= to) return null;
    return computeMethodCost(entryMethod, cls, from, to);
  }, [entryFrom, entryTo, entryMethod, entryClassification]);

  const estimatedCores = useMemo(() => {
    if (!entryMethod || !entryFrom || !entryClassification) return null;
    const from = Number(entryFrom);
    const cls = Number(entryClassification);
    if (entryMethod === 'transfer') {
      const resultTier = from - 2;
      if (resultTier < 0) return null;
      const table = TRANSFER_CORES[cls as 1 | 2 | 3 | 4];
      if (!table) return null;
      return table[resultTier];
    }
    if (entryMethod === 'convergenceTransfer') {
      const idx = from - 1;
      if (idx < 0) return null;
      return CONVERGENCE_TRANSFER_CORES[4][idx];
    }
    return null;
  }, [entryMethod, entryFrom, entryClassification]);

  const methodWarning = useMemo(() => {
    if (!entryMethod || !entryClassification) return null;
    const cls = Number(entryClassification);
    if (entryMethod === 'transfer' && cls === 1) return 'Transfer not available for class 1';
    if (entryMethod === 'transfer' && Number(entryFrom) < 2) return 'Transfer requires source tier ≥ 2';
    if ((entryMethod === 'convergenceFusion' || entryMethod === 'convergenceTransfer') && cls !== 4)
      return 'This method requires class 4';
    if (estimatedCost === null && Number(entryFrom) < Number(entryTo))
      return 'No cost data for this combination';
    return null;
  }, [entryMethod, entryClassification, entryFrom, entryTo, estimatedCost]);

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
    const item: TierProjectItem = { name: itemName.trim(), costGp: Number(itemCost) };
    if (itemMarketPrice) item.marketPriceGp = Number(itemMarketPrice);
    setPendingItems([...pendingItems, item]);
    setItemName('');
    setItemCost('');
    setItemMarketPrice('');
  };

  const handleRemoveItem = (index: number) => {
    setPendingItems(pendingItems.filter((_, i) => i !== index));
  };

  const handleAddMethodCost = () => {
    if (estimatedCost === null || !entryMethod) return;
    const methodLabel = translate(entryMethod);
    const label = `${methodLabel} (${entryFrom}→${entryTo})`;
    setPendingItems([...pendingItems, { name: label, costGp: estimatedCost }]);
    toast.success(`${label}: ${formatGp(estimatedCost)} gp`);
  };

  const handleEditEntry = (entry: TierProjectEntry) => {
    setEditingEntryId(entry.id);
    setEntryFrom(String(entry.fromTier));
    setEntryTo(String(entry.toTier));
    setEntryMethod(entry.method || '');
    setEntryClassification(entry.classification ? String(entry.classification) : '4');
    setEntryNotes(entry.notes);
    setPendingItems(entry.items.map((i) => ({ ...i })));
    setEntryCores(entry.exaltedCores ? String(entry.exaltedCores) : '');
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    resetEntryForm();
  };

  const handleSaveEntry = async () => {
    if (!entryFrom || !entryTo || pendingItems.length === 0) {
      toast.error(translate('fillAllFields'));
      return;
    }
    if (!selectedProject) return;
    const entryData = {
      fromTier: Number(entryFrom),
      toTier: Number(entryTo),
      items: pendingItems,
      notes: entryNotes.trim(),
      method: entryMethod || undefined,
      classification: entryClassification ? Number(entryClassification) : undefined,
      exaltedCores: entryCores ? Number(entryCores) : undefined,
    };
    if (editingEntryId) {
      const result = await dispatch(startUpdateEntry(selectedProject.id, editingEntryId, entryData));
      if (result.ok) {
        toast.success(translate('entryAdded'));
        resetEntryForm();
        setEditingEntryId(null);
      } else {
        toast.error(result.error);
      }
    } else {
      const result = await dispatch(startAddEntry(selectedProject.id, entryData));
      if (result.ok) {
        toast.success(translate('entryAdded'));
        resetEntryForm();
      } else {
        toast.error(result.error);
      }
    }
  };

  const resetEntryForm = () => {
    setEntryFrom('');
    setEntryTo('');
    setEntryMethod('');
    setEntryClassification('4');
    setEntryNotes('');
    setPendingItems([]);
    setEntryCores('');
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
                    {entry.method && (
                      <p className='text-xs text-muted-foreground'>
                        {translate(entry.method)}{entry.classification ? ` · ${translate('classification')} ${entry.classification}` : ''}
                        {entry.exaltedCores ? ` · ${entry.exaltedCores} cores` : ''}
                      </p>
                    )}
                    {entry.items.map((item, idx) => (
                      <p key={idx} className='text-muted-foreground'>
                        {item.name} — {item.costGp.toLocaleString()} gp
                        {item.marketPriceGp ? <span className='text-xs ml-2'>(mkt: {item.marketPriceGp.toLocaleString()} gp)</span> : ''}
                      </p>
                    ))}
                    <p className='text-sm font-medium tabular-nums'>
                      Total: {entryTotalCost(entry).toLocaleString()} gp
                    </p>
                    {entry.notes && <p className='text-xs text-muted-foreground italic'>{entry.notes}</p>}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button variant='ghost' size='icon' onClick={() => handleEditEntry(entry)} aria-label='Edit entry'>
                      <Pencil className='size-4' />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => handleDeleteEntry(entry.id)} aria-label='Delete entry'>
                      <Trash2 className='size-4 text-destructive' />
                    </Button>
                  </div>
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
            <CardTitle className='text-lg'>{editingEntryId ? translate('editEntry') : translate('addEntry')}</CardTitle>
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

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>{translate('method')}</Label>
                <Select value={entryMethod} onValueChange={setEntryMethod}>
                  <SelectTrigger><SelectValue placeholder='Select method' /></SelectTrigger>
                  <SelectContent>
                    {METHODS.map((m) => (
                      <SelectItem key={m} value={m}>{translate(m)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>{translate('classification')}</Label>
                <Select value={entryClassification} onValueChange={setEntryClassification}>
                  <SelectTrigger><SelectValue placeholder='4' /></SelectTrigger>
                  <SelectContent>
                    {CLASSIFICATIONS.map((c) => (
                      <SelectItem key={c} value={String(c)}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>{translate('exaltedCores')}</Label>
                <Input type='number' min={0} placeholder='0' value={entryCores} onChange={(e) => setEntryCores(e.target.value)} />
                {estimatedCores !== null && !entryCores && (
                  <p className='text-xs text-muted-foreground'>{translate('estimatedCores')}: {estimatedCores}</p>
                )}
              </div>
            </div>

            {methodWarning && (
              <div className='rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 p-3 text-sm text-yellow-800 dark:text-yellow-200'>
                {methodWarning}
              </div>
            )}

            {estimatedCost !== null && (
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div className='flex items-center gap-2'>
                  <Coins className='size-4 text-yellow-500' />
                  <span className='text-sm font-medium'>{translate('estimatedCost')}:</span>
                  <span className='text-sm font-bold tabular-nums'>{formatGp(estimatedCost)} gp</span>
                </div>
                <Button type='button' variant='outline' size='sm' onClick={handleAddMethodCost} className='gap-1.5'>
                  <Plus className='size-3.5' />
                  {translate('addCostToItems')}
                </Button>
              </div>
            )}

            <div className='space-y-2'>
              <Label>{translate('items')}</Label>
              <div className='flex gap-2'>
                <Input placeholder='Item name' value={itemName} onChange={(e) => setItemName(e.target.value)} className='flex-1' />
                <Input type='number' placeholder='Cost (gp)' value={itemCost} onChange={(e) => setItemCost(e.target.value)} className='w-28' />
                <Input type='number' placeholder='Mkt price' value={itemMarketPrice} onChange={(e) => setItemMarketPrice(e.target.value)} className='w-28' />
                <Button type='button' variant='outline' size='icon' onClick={handleAddItem} disabled={!itemName.trim() || !itemCost}>
                  <Plus className='size-4' />
                </Button>
              </div>
            </div>
            <div className='flex gap-2 text-xs text-muted-foreground -mt-2'>
              <span>{translate('marketPriceShort')} (optional)</span>
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
            <div className='flex gap-2'>
              {editingEntryId && (
                <Button type='button' variant='outline' onClick={handleCancelEdit} className='gap-2'>
                  <X className='size-4' />
                  {translate('cancel')}
                </Button>
              )}
              <Button onClick={handleSaveEntry} className='gap-2' disabled={pendingItems.length === 0}>
                <Plus className='size-4' />
                {editingEntryId ? translate('updateEntry') : translate('addEntry')}
              </Button>
            </div>
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
                    <p className='text-xs text-muted-foreground tabular-nums'>
                      Total spent: {project.totalSpentGp.toLocaleString()} gp
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
