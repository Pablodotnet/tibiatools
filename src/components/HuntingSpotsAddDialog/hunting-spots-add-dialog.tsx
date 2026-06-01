import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { vocations } from '@/helpers';
import { addHuntingSpot } from '@/firebase/huntingSpots';
import { toast } from 'sonner';
import { captureError } from '@/lib/monitoring';

export function HuntingSpotsAddDialog() {
  const { t } = useTranslation();
  const te = (key: string) => t(`huntingSpotsAdd.${key}`);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [vocationId, setVocationId] = useState('');
  const [levelMin, setLevelMin] = useState('');
  const [levelMax, setLevelMax] = useState('');
  const [location, setLocation] = useState('');
  const [expRaw, setExpRaw] = useState('');
  const [expBonus, setExpBonus] = useState('');
  const [profit, setProfit] = useState('');
  const [supplyCost, setSupplyCost] = useState('0');
  const [setStr, setSetStr] = useState('');
  const [imbuements, setImbuements] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => {
    setName('');
    setVocationId('');
    setLevelMin('');
    setLevelMax('');
    setLocation('');
    setExpRaw('');
    setExpBonus('');
    setProfit('');
    setSupplyCost('0');
    setSetStr('');
    setImbuements('');
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!name || !vocationId || !levelMin || !levelMax || !location || !expRaw || !expBonus || !profit || !setStr) {
      toast.error(te('fillRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const expRawNum = parseInt(expRaw, 10) * 1000;
      const expBonusNum = parseInt(expBonus, 10) * 1000;
      const profitNum = parseInt(profit, 10) * 1000;
      const supplyNum = (parseInt(supplyCost, 10) || 0) * 1000;

      await addHuntingSpot({
        name,
        levelMin: parseInt(levelMin, 10),
        levelMax: parseInt(levelMax, 10),
        location,
        expRaw: expRawNum,
        expBonus: expBonusNum,
        profit: profitNum,
        supplyCost: supplyNum,
        set: setStr,
        imbuements: imbuements ? imbuements.split(',').map((s) => s.trim()).filter(Boolean) : [],
        notes,
        vocationId,
      });

      toast.success(te('spotAdded'));
      reset();
      setOpen(false);
    } catch (e) {
      captureError(e, { context: 'addHuntingSpot' });
      toast.error(te('errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='sm'>{te('addSpot')}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='max-h-[90vh] overflow-y-auto max-w-lg'>
        <AlertDialogHeader>
          <AlertDialogTitle>{te('title')}</AlertDialogTitle>
          <AlertDialogDescription>{te('description')}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className='space-y-3'>
          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>{te('spotName')} *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className='h-8' placeholder={te('spotNamePlaceholder')} />
          </div>

          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>{te('vocation')} *</Label>
            <Select value={vocationId} onValueChange={setVocationId}>
              <SelectTrigger className='h-8'>
                <SelectValue placeholder={te('selectVocation')} />
              </SelectTrigger>
              <SelectContent>
                {vocations.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{te('levelMin')} *</Label>
              <Input type='number' value={levelMin} onChange={(e) => setLevelMin(e.target.value)} min={1} className='h-8' />
            </div>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{te('levelMax')} *</Label>
              <Input type='number' value={levelMax} onChange={(e) => setLevelMax(e.target.value)} min={1} className='h-8' />
            </div>
          </div>

          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>{te('location')} *</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className='h-8' placeholder={te('locationPlaceholder')} />
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{te('expRaw')} *<span className='text-[10px] ml-1'>(k/h)</span></Label>
              <Input type='number' value={expRaw} onChange={(e) => setExpRaw(e.target.value)} min={0} className='h-8' placeholder={te('expRawPlaceholder')} />
            </div>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{te('expBonus')} *<span className='text-[10px] ml-1'>(k/h)</span></Label>
              <Input type='number' value={expBonus} onChange={(e) => setExpBonus(e.target.value)} min={0} className='h-8' placeholder={te('expBonusPlaceholder')} />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{te('profit')} *<span className='text-[10px] ml-1'>(k/h)</span></Label>
              <Input type='number' value={profit} onChange={(e) => setProfit(e.target.value)} className='h-8' placeholder={te('profitPlaceholder')} />
            </div>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{te('supplyCost')}<span className='text-[10px] ml-1'>(k/h)</span></Label>
              <Input type='number' value={supplyCost} onChange={(e) => setSupplyCost(e.target.value)} min={0} className='h-8' placeholder={te('supplyCostPlaceholder')} />
            </div>
          </div>

          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>{te('set')} *</Label>
            <Input value={setStr} onChange={(e) => setSetStr(e.target.value)} className='h-8' placeholder={te('setPlaceholder')} />
          </div>

          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>{te('imbuements')}</Label>
            <Input value={imbuements} onChange={(e) => setImbuements(e.target.value)} className='h-8' placeholder={te('imbuementsPlaceholder')} />
            <p className='text-[10px] text-muted-foreground'>{te('imbuementsHint')}</p>
          </div>

          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>{te('notes')}</Label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className='flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50' placeholder={te('notesPlaceholder')} />
          </div>
        </div>

        <Separator />

        <AlertDialogFooter>
          <Button variant='ghost' onClick={() => { reset(); setOpen(false); }} disabled={submitting}>
            {te('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? te('submitting') : te('submit')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
