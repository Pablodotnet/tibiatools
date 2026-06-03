import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { imbuableItems } from '@/helpers/ImbuingLists';
import {
  imbuementsTypes,
  imbuements,
  imbuingsAvailableByType,
  elementBlockedImbuements,
} from '@/components/ImbuingChecker/imbuements';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatGp, parseGpInput } from '@/helpers/exaltationForge';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const IMBUE_DURATIONS = {
  basic: 20,
  intricate: 55,
  powerful: 100,
} as const;

const GOLD_TOKENS_PER_ITEM: Record<string, number> = {
  basic: 2,
  intricate: 4,
  powerful: 6,
};

export function ImbueCostCalculator() {
  const { t } = useTranslation();
  const ti = (key: string) => t(`imbueCostCalculator.${key}`);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedImbue, setSelectedImbue] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'intricate' | 'powerful' | null>(null);
  const [materialPrices, setMaterialPrices] = useState<Record<string, string>>({});
  const [fullSuccess, setFullSuccess] = useState(false);
  const [goldTokenValue, setGoldTokenValue] = useState('');
  const { copy, copied } = useCopyToClipboard();

  const itemsTypes = Object.keys(imbuableItems);

  const selectedItemData = useMemo(() => {
    if (!selectedType || !selectedItem) return null;
    const section = imbuableItems[selectedType];
    if (!section) return null;
    return section.items.find((i) => i.name === selectedItem) ?? null;
  }, [selectedType, selectedItem]);

  const availableImbues = useMemo(() => {
    if (!selectedType) return [];
    let types = imbuingsAvailableByType[selectedType as keyof typeof imbuingsAvailableByType] ?? [];
    if (selectedItemData?.elements) {
      const blocked = new Set(
        selectedItemData.elements.flatMap((e) => elementBlockedImbuements[e] ?? []),
      );
      types = types.filter((t) => !blocked.has(t));
    }
    return types;
  }, [selectedType, selectedItemData]);

  const selectedImbueData = useMemo(() => {
    if (!selectedImbue) return null;
    return imbuements[selectedImbue as keyof typeof imbuements] ?? null;
  }, [selectedImbue]);

  const tierMaterials = useMemo(() => {
    if (!selectedImbueData || !selectedTier) return [];
    return selectedImbueData[selectedTier] ?? [];
  }, [selectedImbueData, selectedTier]);

  const tierPrice = selectedTier ? imbuementsTypes[selectedTier].price : 0;
  const fullSuccessPrice = selectedTier ? imbuementsTypes[selectedTier].priceForFullSuccess : 0;

  const goldTokenGpValue = parseGpInput(goldTokenValue) || 0;
  const tokensPerItem = selectedTier ? GOLD_TOKENS_PER_ITEM[selectedTier] : 0;

  const materialCost = useMemo(() => {
    return tierMaterials.reduce((sum, m) => {
      const price = parseGpInput(materialPrices[m.itemName] ?? '');
      return sum + m.quantity * price;
    }, 0);
  }, [tierMaterials, materialPrices]);

  const goldTokenTotalCost = useMemo(() => {
    if (!goldTokenGpValue || !tokensPerItem) return 0;
    return tokensPerItem * goldTokenGpValue;
  }, [tokensPerItem, goldTokenGpValue]);

  const handlePriceChange = (itemName: string, value: string) => {
    setMaterialPrices((prev) => ({ ...prev, [itemName]: value }));
  };

  const handleClear = () => {
    setSelectedType(null);
    setSelectedItem(null);
    setSelectedImbue(null);
    setSelectedTier(null);
    setMaterialPrices({});
    setFullSuccess(false);
    setGoldTokenValue('');
  };

  const handleTierChange = (tier: string) => {
    setSelectedTier(tier as 'basic' | 'intricate' | 'powerful');
    setMaterialPrices({});
  };

  const successFee = fullSuccess ? fullSuccessPrice : 0;
  const total = materialCost + tierPrice + successFee;
  const duration = selectedTier ? IMBUE_DURATIONS[selectedTier] : 0;
  const costPerHour = duration > 0 ? total / duration : 0;
  const totalWithTokens = (goldTokenTotalCost || materialCost) + tierPrice + successFee;
  const costPerHourWithTokens = duration > 0 ? totalWithTokens / duration : 0;

  return (
    <>
      <div className='grid w-full items-center gap-4'>
        <div className='flex flex-col space-y-2'>
          <Label htmlFor='item_type'>{ti('itemType')}</Label>
          <Select onValueChange={(v) => { setSelectedType(v); setSelectedItem(null); setSelectedImbue(null); setSelectedTier(null); setMaterialPrices({}); }} value={selectedType ?? ''}>
            <SelectTrigger id='item_type'>
              <SelectValue placeholder={ti('selectType')} />
            </SelectTrigger>
            <SelectContent position='popper'>
              {itemsTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {imbuableItems[type].displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedType && (
          <div className='flex flex-col space-y-2'>
            <Label htmlFor='item_select'>{ti('item')}</Label>
            <Select onValueChange={(v) => { setSelectedItem(v); setSelectedImbue(null); setSelectedTier(null); setMaterialPrices({}); }} value={selectedItem ?? ''}>
              <SelectTrigger id='item_select'>
                <SelectValue placeholder={ti('selectItem')} />
              </SelectTrigger>
              <SelectContent position='popper'>
                {imbuableItems[selectedType].items.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                    {item.imbuingSlots > 0 ? ` (${item.imbuingSlots} ${item.imbuingSlots === 1 ? ti('slot') : ti('slots')})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedItem && (
          <div className='flex flex-col space-y-2'>
            <Label htmlFor='imbue_type'>{ti('imbueType')}</Label>
            <Select onValueChange={(v) => { setSelectedImbue(v); setSelectedTier(null); setMaterialPrices({}); }} value={selectedImbue ?? ''}>
              <SelectTrigger id='imbue_type'>
                <SelectValue placeholder={ti('selectImbueType')} />
              </SelectTrigger>
              <SelectContent position='popper'>
                {availableImbues.map((imbue) => (
                  <SelectItem key={imbue} value={imbue}>
                    {imbuements[imbue as keyof typeof imbuements]?.effect ?? imbue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedImbue && (
          <div className='flex flex-col space-y-2'>
            <Label htmlFor='tier_select'>{ti('tier')}</Label>
            <Select onValueChange={handleTierChange} value={selectedTier ?? ''}>
              <SelectTrigger id='tier_select'>
                <SelectValue placeholder={ti('selectTier')} />
              </SelectTrigger>
              <SelectContent position='popper'>
                {(['basic', 'intricate', 'powerful'] as const).map((tier) => {
                  const data = imbuementsTypes[tier];
                  const hours = IMBUE_DURATIONS[tier];
                  return (
                    <SelectItem key={tier} value={tier}>
                      {ti(tier)} — {data.price.toLocaleString()} gp ({hours}h)
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedTier && (
          <div className='space-y-3'>
            <div className='flex items-end gap-4'>
              <h3 className='text-sm font-medium'>{ti('materials')}</h3>
              {tokensPerItem > 0 && (
                <div className='flex items-center gap-2'>
                  <Label htmlFor='gold_token_val' className='text-xs whitespace-nowrap'>{ti('goldTokenValue')}</Label>
                  <Input
                    id='gold_token_val'
                    type='text'
                    inputMode='numeric'
                    placeholder='25000'
                    value={goldTokenValue}
                    onChange={(e) => setGoldTokenValue(e.target.value)}
                    className='h-7 w-28 text-xs tabular-nums'
                  />
                </div>
              )}
            </div>
            <div className='rounded-md border'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b bg-muted/50'>
                    <th className='px-3 py-2 text-left font-medium'>{ti('material')}</th>
                    <th className='px-3 py-2 text-right font-medium'>{ti('quantity')}</th>
                    <th className='px-3 py-2 text-right font-medium'>{ti('pricePerUnit')}</th>
                    <th className='px-3 py-2 text-right font-medium'>{ti('subtotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tierMaterials.map((m) => {
                    const priceStr = materialPrices[m.itemName] ?? '';
                    const price = parseGpInput(priceStr);
                    const marketSub = m.quantity * price;
                    return (
                      <tr key={m.itemName} className='border-b last:border-0'>
                        <td className='px-3 py-2'>{m.itemName}</td>
                        <td className='px-3 py-2 text-right tabular-nums'>{m.quantity.toLocaleString()}</td>
                        <td className='px-3 py-2'>
                          <Input
                            type='text'
                            inputMode='numeric'
                            placeholder='0'
                            value={priceStr}
                            onChange={(e) => handlePriceChange(m.itemName, e.target.value)}
                            className='h-8 w-28 ml-auto text-right tabular-nums'
                          />
                        </td>
                        <td className='px-3 py-2 text-right tabular-nums'>{formatGp(marketSub)}</td>
                      </tr>
                    );
                  })}
                  <tr className='border-b bg-muted/30'>
                    <td className='px-3 py-2 font-medium'>{ti('imbueGoldCost')}</td>
                    <td />
                    <td />
                    <td className='px-3 py-2 text-right tabular-nums'>{formatGp(tierPrice)}</td>
                  </tr>
                  <tr className='border-b bg-muted/30'>
                    <td className='px-3 py-2'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs'>{ti('fullSuccess')}</span>
                        <input type='checkbox' className='size-4 accent-blue-900' checked={fullSuccess} onChange={(e) => setFullSuccess(e.target.checked)} />
                      </div>
                    </td>
                    <td />
                    <td />
                    <td className='px-3 py-2 text-right tabular-nums'>
                      {fullSuccess ? formatGp(successFee) : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='rounded-md border bg-primary/5 p-3 space-y-1'>
              <div className='flex justify-between text-sm'>
                <span className='font-medium'>{ti('totalMarket')}</span>
                <span className='font-bold tabular-nums'>{formatGp(total)} gp</span>
              </div>
              {goldTokenGpValue > 0 && (
                <div className='flex justify-between text-sm'>
                  <span className='font-medium'>{ti('totalViaYana')} ({tokensPerItem} × {formatGp(goldTokenGpValue)})</span>
                  <span className={`font-bold tabular-nums ${totalWithTokens < total ? 'text-green-600' : 'text-destructive'}`}>
                    {formatGp(totalWithTokens)} gp
                  </span>
                </div>
              )}
              <Separator className='my-1' />
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>{ti('costPerHour')} ({duration}h)</span>
                <span className='tabular-nums'>{formatGp(Math.round(costPerHour))} gp/h</span>
              </div>
              {goldTokenGpValue > 0 && (
                <div className='flex justify-between text-sm text-muted-foreground'>
                  <span>{ti('costPerHour')} {ti('viaYana')} ({duration}h)</span>
                  <span className='tabular-nums'>{formatGp(Math.round(costPerHourWithTokens))} gp/h</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className='flex justify-between mt-6'>
        {selectedTier && (
          <Button variant='outline' size='sm' onClick={() => {
            const lines: string[] = [];
            lines.push(`${ti('item')}: ${selectedItem ?? ''}`);
            lines.push(`${ti('imbueType')}: ${selectedImbue ?? ''}`);
            lines.push(`${ti('tier')}: ${selectedTier ?? ''}`);
            lines.push(`${ti('totalMarket')}: ${formatGp(total)} gp`);
            if (goldTokenGpValue > 0) {
              lines.push(`${ti('totalViaYana')}: ${formatGp(totalWithTokens)} gp`);
            }
            lines.push(`${ti('costPerHour')}: ${formatGp(Math.round(costPerHour))} gp/h (${duration}h)`);
            if (goldTokenGpValue > 0) {
              lines.push(`${ti('costPerHour')} ${ti('viaYana')}: ${formatGp(Math.round(costPerHourWithTokens))} gp/h`);
            }
            copy(lines.join('\n'));
            toast.success(t('common.copied'));
          }} className='cursor-pointer'>
            <Copy className='size-3.5' />
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        )}
        <Button variant='outline' onClick={handleClear}>
          {ti('clear')}
        </Button>
      </div>
    </>
  );
}
