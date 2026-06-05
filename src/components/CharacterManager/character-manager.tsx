import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirestoreFetch } from '@/hooks/useFirestoreFetch';
import { getUserCharacters, addCharacter, deleteCharacter, type CharacterDoc } from '@/firebase/characters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, User, Swords, Wand2, HeartHandshake, Crosshair } from 'lucide-react';
import { toast } from 'sonner';
import { captureError } from '@/lib/monitoring';

const VOCATIONS = [
  { id: 'knight', icon: Swords },
  { id: 'paladin', icon: Crosshair },
  { id: 'sorcerer', icon: Wand2 },
  { id: 'druid', icon: HeartHandshake },
];

function getVocationIcon(voc: string) {
  const found = VOCATIONS.find((v) => v.id === voc);
  return found?.icon ?? User;
}

export function CharacterManager() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`characters.${key}`);
  const { data: charsData, loading, refresh } = useFirestoreFetch<CharacterDoc[]>(getUserCharacters, { context: 'load characters', errorKey: 'characters.loadError' });
  const characters = charsData ?? [];
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newVocation, setNewVocation] = useState('');
  const [newLevel, setNewLevel] = useState('');

  const handleAdd = async () => {
    if (!newName.trim() || !newVocation || !newLevel.trim()) {
      toast.error(tc('fillRequired'));
      return;
    }
    setAdding(true);
    try {
      await addCharacter({ name: newName.trim(), vocation: newVocation, level: Number(newLevel) || 1 });
      await refresh();
      setNewName('');
      setNewVocation('');
      setNewLevel('');
      toast.success(tc('added'));
    } catch (e) {
      captureError(e, { context: 'add character' });
      toast.error(tc('addError'));
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCharacter(id);
      await refresh();
      toast.success(tc('deleted'));
    } catch (e) {
      captureError(e, { context: 'delete character' });
      toast.error(tc('deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className='flex items-center justify-center py-8'><Loader2 className='size-6 animate-spin text-muted-foreground' /></div>;
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-md border p-4 space-y-3'>
        <h2 className='text-sm font-semibold'>{tc('addNew')}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-3'>
          <div className='space-y-1'>
            <Label htmlFor='char-name' className='text-xs text-muted-foreground'>{tc('name')}</Label>
            <Input id='char-name' value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={tc('namePlaceholder')} className='h-8' />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='char-vocation' className='text-xs text-muted-foreground'>{tc('vocation')}</Label>
            <Select value={newVocation} onValueChange={setNewVocation}>
              <SelectTrigger id='char-vocation' className='h-8'>
                <SelectValue placeholder={tc('vocationPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='knight'>{tc('vocation_knight')}</SelectItem>
                <SelectItem value='paladin'>{tc('vocation_paladin')}</SelectItem>
                <SelectItem value='sorcerer'>{tc('vocation_sorcerer')}</SelectItem>
                <SelectItem value='druid'>{tc('vocation_druid')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='char-level' className='text-xs text-muted-foreground'>{tc('level')}</Label>
            <Input id='char-level' type='number' min={1} value={newLevel} onChange={(e) => setNewLevel(e.target.value)} className='h-8' />
          </div>
          <div className='flex items-end'>
            <Button size='sm' onClick={handleAdd} disabled={adding || !newName || !newVocation || !newLevel}>
              {adding ? <Loader2 className='size-3 animate-spin mr-1' /> : <Plus className='size-3 mr-1' />}
              {tc('add')}
            </Button>
          </div>
        </div>
      </div>

      {characters.length === 0 ? (
        <p className='text-sm text-muted-foreground text-center py-4'>{tc('empty')}</p>
      ) : (
        <div className='space-y-2'>
          {characters.map((c) => {
            const Icon = getVocationIcon(c.vocation);
            return (
              <div key={c.id} className='flex items-center justify-between rounded-md border p-3'>
                <div className='flex items-center gap-3'>
                  <Icon className='size-5 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>{c.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {tc(`vocation_${c.vocation}`)} &middot; {tc('level')} {c.level}
                    </p>
                  </div>
                </div>
                <Button variant='ghost' size='sm' onClick={() => handleDelete(c.id)} disabled={deletingId === c.id} className='h-7 text-xs text-muted-foreground' aria-label={tc('delete')}>
                  {deletingId === c.id ? <Loader2 className='size-3 animate-spin' /> : <Trash2 className='size-3' />}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
