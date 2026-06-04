import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
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
  startDuplicateProject,
} from '@/store/tierProjects';
import type { TierProjectItem, TierProjectEntry } from '@/types/tierProject';
import { Trash2, Plus, ArrowLeft, Globe, Lock, X, Coins, Pencil, ArrowUpDown, BarChart3, Cpu, Diamond, TrendingUp, Search, Copy, Package } from 'lucide-react';
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

  const [entryFrom, setEntryFrom] = useState(-1);
  const [entryTo, setEntryTo] = useState(-1);
  const [entryMethod, setEntryMethod] = useState('');
  const [entryClassification, setEntryClassification] = useState('4');
  const [entryNotes, setEntryNotes] = useState('');
  const [pendingItems, setPendingItems] = useState<TierProjectItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [itemMarketPrice, setItemMarketPrice] = useState('');
  const [entryCores, setEntryCores] = useState('');
  const [entryCorePrice, setEntryCorePrice] = useState('');
  const [entryDust, setEntryDust] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const estimatedCost = useMemo(() => {
    if (entryFrom < 0 || entryTo < 0 || !entryMethod || !entryClassification) return null;
    const from = entryFrom;
    const to = entryTo;
    const cls = Number(entryClassification);
    if (from >= to) return null;
    return computeMethodCost(entryMethod, cls, from, to);
  }, [entryFrom, entryTo, entryMethod, entryClassification]);

  const estimatedCores = useMemo(() => {
    if (!entryMethod || entryFrom < 0 || !entryClassification) return null;
    const from = entryFrom;
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
    if (entryMethod === 'transfer' && cls === 1) return translate('transferNotForClass1');
    if (entryMethod === 'transfer' && entryFrom >= 0 && entryFrom < 2) return translate('transferMinTier');
    if ((entryMethod === 'convergenceFusion' || entryMethod === 'convergenceTransfer') && cls !== 4)
      return translate('requiresClass4');
    if (estimatedCost === null && entryFrom < entryTo)
      return translate('noCostData');
    return null;
  }, [entryMethod, entryClassification, entryFrom, entryTo, estimatedCost]);

  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'tier'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterTierMin, setFilterTierMin] = useState(-1);
  const [filterTierMax, setFilterTierMax] = useState(-1);

  const sortedEntries = useMemo(() => {
    const sorted = [...currentEntries];
    sorted.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.createdAt - b.createdAt;
      else if (sortBy === 'cost') {
        const aTotal = a.items.reduce((s, i) => s + i.costGp, 0);
        const bTotal = b.items.reduce((s, i) => s + i.costGp, 0);
        cmp = aTotal - bTotal;
      } else if (sortBy === 'tier') cmp = a.fromTier - b.fromTier;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [currentEntries, sortBy, sortOrder]);

  const filteredEntries = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return sortedEntries.filter((e) => {
      if (term && !e.items.some((i) => i.name.toLowerCase().includes(term))) return false;
      if (filterMethod && e.method !== filterMethod) return false;
      if (filterTierMin >= 0 && e.fromTier < filterTierMin) return false;
      if (filterTierMax >= 0 && e.toTier > filterTierMax) return false;
      return true;
    });
  }, [sortedEntries, searchTerm, filterMethod, filterTierMin, filterTierMax]);

  const stats = useMemo(() => {
    const count = currentEntries.length;
    const totalGp = currentEntries.reduce((sum, e) => sum + e.items.reduce((s, i) => s + i.costGp, 0), 0);
    const totalCores = currentEntries.reduce((sum, e) => sum + (e.exaltedCores ?? 0), 0);
    const totalCoreCost = currentEntries.reduce((sum, e) => sum + ((e.exaltedCores ?? 0) * (e.exaltedCorePriceGp ?? 0)), 0);
    const totalDust = currentEntries.reduce((sum, e) => sum + (e.dust ?? 0), 0);
    const avgCost = count > 0 ? totalGp / count : 0;
    return { count, totalGp, totalCores, totalCoreCost, totalDust, avgCost };
  }, [currentEntries]);

  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');

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

  const handleConfirmDeleteProject = async () => {
    if (!deleteProjectId) return;
    const result = await dispatch(startDeleteProject(deleteProjectId));
    setDeleteProjectId(null);
    if (result.ok) {
      toast.success(translate('projectDeleted'));
    } else {
      toast.error(result.error);
    }
  };

  const handleOpenDuplicate = () => {
    if (!selectedProject) return;
    setDuplicateName(`${translate('copyOf')} ${selectedProject.name}`);
    setDuplicateDialogOpen(true);
  };

  const handleConfirmDuplicate = async () => {
    if (!selectedProject || !duplicateName.trim()) return;
    const result = await dispatch(startDuplicateProject(selectedProject.id, duplicateName.trim()));
    setDuplicateDialogOpen(false);
    if (result.ok) {
      toast.success(translate('projectDuplicated'));
    } else {
      toast.error(result.error);
    }
  };

  const handleSelectProject = async (projectId: string) => {
    dispatch(startSelectProject(projectId));
    try {
      await dispatch(startFetchEntries(projectId));
    } catch {
      toast.error(translate('loadEntriesFailed'));
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

  const totalCoreCost = useMemo(() => {
    const cores = Number(entryCores);
    const price = Number(entryCorePrice);
    if (cores > 0 && price > 0) return cores * price;
    return null;
  }, [entryCores, entryCorePrice]);

  const handleAddMethodCost = () => {
    if (estimatedCost === null || !entryMethod) return;
    const methodLabel = translate(entryMethod);
    const label = `${methodLabel} (${entryFrom}→${entryTo})`;
    setPendingItems([...pendingItems, { name: label, costGp: estimatedCost }]);
    toast.success(t('myTierProjects.methodCostAdded', { method: label, cost: formatGp(estimatedCost) }));
  };

  const handleAddCoreCost = () => {
    if (totalCoreCost === null) return;
    const label = `${entryCores} Exalted Cores × ${formatGp(Number(entryCorePrice))} gp`;
    setPendingItems([...pendingItems, { name: label, costGp: totalCoreCost }]);
    toast.success(t('myTierProjects.coreCostAdded', { cost: formatGp(totalCoreCost) }));
  };

  const handleEditEntry = (entry: TierProjectEntry) => {
    setEditingEntryId(entry.id);
    setEntryFrom(entry.fromTier);
    setEntryTo(entry.toTier);
    setEntryMethod(entry.method || '');
    setEntryClassification(entry.classification ? String(entry.classification) : '4');
    setEntryNotes(entry.notes);
    setPendingItems(entry.items.map((i) => ({ ...i })));
    setEntryCores(entry.exaltedCores ? String(entry.exaltedCores) : '');
    setEntryCorePrice(entry.exaltedCorePriceGp ? String(entry.exaltedCorePriceGp) : '');
    setEntryDust(entry.dust ? String(entry.dust) : '');
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    resetEntryForm();
  };

  const handleSaveEntry = async () => {
    if (entryFrom < 0 || entryTo < 0 || pendingItems.length === 0) {
      toast.error(translate('fillAllFields'));
      return;
    }
    if (!selectedProject) return;
    const entryData = {
      fromTier: entryFrom,
      toTier: entryTo,
      items: pendingItems,
      notes: entryNotes.trim(),
      method: entryMethod || undefined,
      classification: entryClassification ? Number(entryClassification) : undefined,
      exaltedCores: entryCores ? Number(entryCores) : undefined,
      exaltedCorePriceGp: entryCorePrice ? Number(entryCorePrice) : undefined,
      dust: entryDust ? Number(entryDust) : undefined,
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
    setEntryFrom(-1);
    setEntryTo(-1);
    setEntryMethod('');
    setEntryClassification('4');
    setEntryNotes('');
    setPendingItems([]);
    setEntryCores('');
    setEntryCorePrice('');
    setEntryDust('');
  };

  const handleConfirmDeleteEntry = async () => {
    if (!deleteEntryId || !selectedProject) return;
    const result = await dispatch(startDeleteEntry(selectedProject.id, deleteEntryId));
    setDeleteEntryId(null);
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
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm' onClick={handleOpenDuplicate} className='gap-1.5'>
                  <Copy className='size-3.5' />
                  {translate('duplicate')}
                </Button>
                <Button variant='outline' size='sm' onClick={handleToggleVisibility} className='gap-2'>
                  {selectedProject.isPublic ? <Globe className='size-4' /> : <Lock className='size-4' />}
                  {selectedProject.isPublic ? translate('public') : translate('private')}
                </Button>
              </div>
            </div>
            <CardDescription>
              {t('myTierProjects.targetCurrentTier', { target: selectedProject.targetTier, current: selectedProject.currentTier })}
            </CardDescription>
            <div className='mt-2'>
              <Progress value={Math.min(100, (selectedProject.currentTier / Math.max(1, selectedProject.targetTier)) * 100)} />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <BarChart3 className='size-4' />
              {translate('stats')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 sm:grid-cols-6 gap-3 text-sm'>
              <div className='rounded-lg border p-3 space-y-1'>
                <p className='text-xs text-muted-foreground flex items-center gap-1'><Diamond className='size-3' /> {translate('entries')}</p>
                <p className='font-bold tabular-nums'>{stats.count}</p>
              </div>
              <div className='rounded-lg border p-3 space-y-1'>
                <p className='text-xs text-muted-foreground flex items-center gap-1'><Coins className='size-3' /> {translate('totalSpentGp')}</p>
                <p className='font-bold tabular-nums'>{stats.totalGp.toLocaleString()} gp</p>
              </div>
              <div className='rounded-lg border p-3 space-y-1'>
                <p className='text-xs text-muted-foreground flex items-center gap-1'><Cpu className='size-3' /> {translate('totalCores')}</p>
                <p className='font-bold tabular-nums'>{stats.totalCores}</p>
              </div>
              <div className='rounded-lg border p-3 space-y-1'>
                <p className='text-xs text-muted-foreground flex items-center gap-1'><Cpu className='size-3' /> {translate('totalCoreCost')}</p>
                <p className='font-bold tabular-nums'>{stats.totalCoreCost.toLocaleString()} gp</p>
              </div>
              <div className='rounded-lg border p-3 space-y-1'>
                <p className='text-xs text-muted-foreground flex items-center gap-1'><Package className='size-3' /> {translate('totalDust')}</p>
                <p className='font-bold tabular-nums'>{stats.totalDust}</p>
              </div>
              <div className='rounded-lg border p-3 space-y-1'>
                <p className='text-xs text-muted-foreground flex items-center gap-1'><TrendingUp className='size-3' /> {translate('avgCost')}</p>
                <p className='font-bold tabular-nums'>{Math.round(stats.avgCost).toLocaleString()} gp</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>{translate('entries')}</CardTitle>
              <div className='flex items-center gap-2'>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'cost' | 'tier')}>
                  <SelectTrigger className='w-28 h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='date'>{translate('sortByDate')}</SelectItem>
                    <SelectItem value='cost'>{translate('sortByCost')}</SelectItem>
                    <SelectItem value='tier'>{translate('sortByTier')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant='ghost' size='icon' className='size-8' onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} aria-label={translate('toggleSortOrder')}>
                  <ArrowUpDown className='size-4' />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2 pb-2'>
              <div className='relative flex-1 min-w-[160px]'>
                <Search className='absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground' />
                <Input
                  placeholder={translate('searchItems')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='h-8 pl-7 text-xs'
                />
              </div>
              <select
                className='h-8 rounded-md border border-input bg-transparent px-2 text-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring'
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                aria-label={translate('method')}
              >
                <option value=''>{translate('allMethods')}</option>
                {METHODS.map((m) => <option key={m} value={m}>{translate(m)}</option>)}
              </select>
              <select
                className='h-8 rounded-md border border-input bg-transparent px-2 text-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring'
                value={filterTierMin}
                onChange={(e) => setFilterTierMin(Number(e.target.value))}
                aria-label={translate('minTier')}
              >
                <option value={-1}>{translate('minTier')}</option>
                {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                className='h-8 rounded-md border border-input bg-transparent px-2 text-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring'
                value={filterTierMax}
                onChange={(e) => setFilterTierMax(Number(e.target.value))}
                aria-label={translate('maxTier')}
              >
                <option value={-1}>{translate('maxTier')}</option>
                {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {(searchTerm || filterMethod || filterTierMin >= 0 || filterTierMax >= 0) && (
                <X
                  className='size-4 cursor-pointer text-muted-foreground hover:text-foreground'
                  onClick={() => {
                    setSearchTerm('');
                    setFilterMethod('');
                    setFilterTierMin(-1);
                    setFilterTierMax(-1);
                  }}
                />
              )}
            </div>
            {currentEntries.length === 0 && !entriesLoading && (
              <p className='text-muted-foreground text-center py-4 text-sm'>
                {translate('noEntries')}
              </p>
            )}
            {currentEntries.length > 0 && filteredEntries.length === 0 && !entriesLoading && (
              <p className='text-muted-foreground text-center py-4 text-sm'>
                {translate('noMatches')}
              </p>
            )}
            {filteredEntries.map((entry) => (
              <div key={entry.id} className='rounded-lg border p-3'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1 text-sm'>
                    <p className='font-medium'>
                      {t('myTierProjects.tierRange', { from: entry.fromTier, to: entry.toTier })}
                    </p>
                    {entry.method && (
                      <p className='text-xs text-muted-foreground'>
                        {translate(entry.method)}{entry.classification ? ` · ${translate('classification')} ${entry.classification}` : ''}
                        {entry.exaltedCores ? ` · ${entry.exaltedCores} cores${entry.exaltedCorePriceGp ? ` @ ${formatGp(entry.exaltedCorePriceGp)} gp` : ''}` : ''}{entry.dust ? ` · ${entry.dust} dust` : ''}
                      </p>
                    )}
                    {entry.items.map((item, idx) => (
                      <p key={idx} className='text-muted-foreground'>
                        {item.name} — {item.costGp.toLocaleString()} gp
                        {item.marketPriceGp ? <span className='text-xs ml-2'>(mkt: {item.marketPriceGp.toLocaleString()} gp)</span> : ''}
                      </p>
                    ))}
                    <p className='text-sm font-medium tabular-nums'>
                      {translate('totalLabel')}: {entryTotalCost(entry).toLocaleString()} gp
                    </p>
                    {entry.notes && <p className='text-xs text-muted-foreground italic'>{entry.notes}</p>}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button variant='ghost' size='icon' onClick={() => handleEditEntry(entry)} aria-label={translate('editEntry')}>
                      <Pencil className='size-4' />
                    </Button>
                    <AlertDialog open={deleteEntryId === entry.id} onOpenChange={(open) => !open && setDeleteEntryId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' size='icon' onClick={() => setDeleteEntryId(entry.id)} aria-label={translate('delete')}>
                          <Trash2 className='size-4 text-destructive' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{translate('deleteEntryTitle') || 'Delete entry?'}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {translate('deleteEntryConfirm') || 'This will remove this entry and recalculate the total spent.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteEntryId(null)}>{translate('cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={handleConfirmDeleteEntry} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                            {translate('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
            {entriesLoading && (
              <p className='text-center text-sm text-muted-foreground py-2'>{translate('loadingEntries')}</p>
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
                <select
                  className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring'
                  value={entryFrom}
                  onChange={(e) => setEntryFrom(Number(e.target.value))}
                  aria-label={translate('fromTier')}
                >
                  <option value={-1}>-</option>
                  {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className='space-y-2'>
                <Label>{translate('toTier')}</Label>
                <select
                  className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring'
                  value={entryTo}
                  onChange={(e) => setEntryTo(Number(e.target.value))}
                  aria-label={translate('toTier')}
                >
                  <option value={-1}>-</option>
                  {TIERS.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>{translate('method')}</Label>
                <Select value={entryMethod} onValueChange={setEntryMethod}>
                  <SelectTrigger><SelectValue placeholder={translate('selectMethod')} /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder={translate('classification')} /></SelectTrigger>
                  <SelectContent>
                    {CLASSIFICATIONS.map((c) => (
                      <SelectItem key={c} value={String(c)}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>{translate('exaltedCores')}</Label>
                <Input type='number' min={0} placeholder={translate('count')} value={entryCores} onChange={(e) => setEntryCores(e.target.value)} />
                {estimatedCores !== null && !entryCores && (
                  <p className='text-xs text-muted-foreground'>{translate('estimatedCores')}: {estimatedCores}</p>
                )}
                <Input type='number' min={0} placeholder={translate('pricePerCore')} value={entryCorePrice} onChange={(e) => setEntryCorePrice(e.target.value)} className='mt-1' />
                {totalCoreCost !== null && (
                  <div className='flex items-center justify-between rounded-lg border p-2 mt-1'>
                    <span className='text-sm'>{translate('totalLabel')}: <span className='font-bold tabular-nums'>{formatGp(totalCoreCost)} gp</span></span>
                    <Button type='button' variant='outline' size='sm' onClick={handleAddCoreCost} className='gap-1'>
                      <Plus className='size-3.5' />
                      {translate('addCostToItems')}
                    </Button>
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <Label>{translate('dustRequired')}</Label>
                <Input type='number' min={0} placeholder={translate('count')} value={entryDust} onChange={(e) => setEntryDust(e.target.value)} />
              </div>
            </div>

            {methodWarning && (
              <Alert className='border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/20 [&>div]:col-span-2'>
                <AlertTitle className='text-yellow-800 dark:text-yellow-200'>{translate('warning')}</AlertTitle>
                <AlertDescription className='text-yellow-800 dark:text-yellow-200'>{methodWarning}</AlertDescription>
              </Alert>
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
                <Input placeholder={translate('itemName')} value={itemName} onChange={(e) => setItemName(e.target.value)} className='flex-1' />
                <Input type='number' placeholder={translate('costGp')} value={itemCost} onChange={(e) => setItemCost(e.target.value)} className='w-28' />
                <Input type='number' placeholder={translate('marketPriceShort')} value={itemMarketPrice} onChange={(e) => setItemMarketPrice(e.target.value)} className='w-28' />
                <Button type='button' variant='outline' size='icon' onClick={handleAddItem} disabled={!itemName.trim() || !itemCost} aria-label={translate('addItem')}>
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
                    <Button variant='ghost' size='icon' className='size-6' onClick={() => handleRemoveItem(idx)} aria-label={translate('delete')}>
                      <X className='size-3' />
                    </Button>
                  </div>
                ))}
                <div className='border-t pt-1.5 text-sm font-medium tabular-nums'>
                  {translate('totalLabel')}: {pendingTotal.toLocaleString()} gp
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <Label>{translate('notes')}</Label>
              <Input placeholder={translate('optional')} value={entryNotes} onChange={(e) => setEntryNotes(e.target.value)} />
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

        <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{translate('duplicateProjectTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {translate('duplicateProjectDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='py-2'>
              <Input value={duplicateName} onChange={(e) => setDuplicateName(e.target.value)} placeholder={translate('projectName')} />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>{translate('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDuplicate} disabled={!duplicateName.trim()}>
                <Copy className='size-3.5' />
                {translate('duplicate')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className='w-full max-w-2xl mx-auto mt-6 space-y-4'>
      <Card>
        <CardHeader>
          <h1 className="sr-only">{translate('title')}</h1>
          <CardTitle>{translate('title')}</CardTitle>
          <CardDescription>{translate('description')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4 rounded-lg border p-4'>
            <h3 className='font-semibold text-sm'>{translate('createNew')}</h3>
            <div className='space-y-2'>
              <Label>{translate('projectName')}</Label>
              <Input placeholder={translate('projectNamePlaceholder')} value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className='space-y-2'>
              <Label>{translate('targetTier')}</Label>
              <Input type='number' min={1} max={10} placeholder={translate('targetTierPlaceholder')} value={newTarget} onChange={(e) => setNewTarget(e.target.value)} />
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
                      {t('myTierProjects.targetCurrentTier', { target: project.targetTier, current: project.currentTier })}
                    </p>
                    <p className='text-xs text-muted-foreground tabular-nums'>
                      {translate('totalSpent')}: {project.totalSpentGp.toLocaleString()} gp
                    </p>
                    <div className='mt-1.5 w-32'>
                      <Progress value={Math.min(100, (project.currentTier / Math.max(1, project.targetTier)) * 100)} />
                    </div>
                  </div>
                  <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                    <AlertDialog open={deleteProjectId === project.id} onOpenChange={(open) => !open && setDeleteProjectId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' size='icon' onClick={() => setDeleteProjectId(project.id)} aria-label={translate('delete')}>
                          <Trash2 className='size-4 text-destructive' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{translate('deleteConfirm')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {translate('deleteProjectConfirm') || 'This will permanently delete this project and all its entries.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteProjectId(null)}>{translate('cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={handleConfirmDeleteProject} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                            {translate('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
