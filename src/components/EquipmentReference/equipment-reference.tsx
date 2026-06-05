import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { imbuableItems } from '@/helpers/ImbuingLists';
import { imbuingsAvailableByType, imbuements } from '@/components/ImbuingChecker/imbuements';
import { VocationsIcons } from '@/helpers/vocations-icons';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const VOCATIONS = [
  { id: 'knight', name: 'Knight', icon: VocationsIcons.knightGif },
  { id: 'paladin', name: 'Paladin', icon: VocationsIcons.paladinGif },
  { id: 'sorcerer', name: 'Sorcerer', icon: VocationsIcons.sorcererGif },
  { id: 'druid', name: 'Druid', icon: VocationsIcons.druidGif },
  { id: 'monk', name: 'Monk', icon: VocationsIcons.monkGif },
] as const;

type VocationId = (typeof VOCATIONS)[number]['id'];

const VOCATION_SLOTS: Record<VocationId, { key: string; label: string; itemTypes: string[] }[]> = {
  knight: [
    { key: 'helmet', label: 'Helmet', itemTypes: ['helmets'] },
    { key: 'armor', label: 'Armor', itemTypes: ['armors'] },
    { key: 'boots', label: 'Boots', itemTypes: ['boots'] },
    { key: 'shield', label: 'Shield', itemTypes: ['shields'] },
    { key: 'weapon', label: 'Weapon', itemTypes: ['swords', 'axes', 'clubs'] },
  ],
  paladin: [
    { key: 'helmet', label: 'Helmet', itemTypes: ['helmets'] },
    { key: 'armor', label: 'Armor', itemTypes: ['armors'] },
    { key: 'boots', label: 'Boots', itemTypes: ['boots'] },
    { key: 'shield', label: 'Shield', itemTypes: ['shields'] },
    { key: 'weapon', label: 'Weapon', itemTypes: ['bows', 'crossbows'] },
  ],
  sorcerer: [
    { key: 'helmet', label: 'Helmet', itemTypes: ['helmets'] },
    { key: 'armor', label: 'Armor', itemTypes: ['armors'] },
    { key: 'boots', label: 'Boots', itemTypes: ['boots'] },
    { key: 'shield', label: 'Spellbook', itemTypes: ['spellbooks'] },
    { key: 'weapon', label: 'Wand', itemTypes: ['wands'] },
  ],
  druid: [
    { key: 'helmet', label: 'Helmet', itemTypes: ['helmets'] },
    { key: 'armor', label: 'Armor', itemTypes: ['armors'] },
    { key: 'boots', label: 'Boots', itemTypes: ['boots'] },
    { key: 'shield', label: 'Spellbook', itemTypes: ['spellbooks'] },
    { key: 'weapon', label: 'Rod', itemTypes: ['rods'] },
  ],
  monk: [
    { key: 'helmet', label: 'Helmet', itemTypes: ['helmets'] },
    { key: 'armor', label: 'Armor', itemTypes: ['armors'] },
    { key: 'boots', label: 'Boots', itemTypes: ['boots'] },
    { key: 'shield', label: 'Shield', itemTypes: ['shields'] },
  ],
};

const ALL_ELEMENTS = ['fire', 'ice', 'energy', 'earth', 'death', 'holy'] as const;

const ELEMENT_LABELS: Record<string, string> = {
  fire: 'Fire',
  ice: 'Ice',
  energy: 'Energy',
  earth: 'Earth',
  death: 'Death',
  holy: 'Holy',
};

export function EquipmentReference() {
  const { t } = useTranslation();
  const te = (key: string) => t(`equipmentReference.${key}`);

  const [vocation, setVocation] = useState<VocationId>('knight');
  const [activeSlot, setActiveSlot] = useState<string>('helmet');
  const [filterElements, setFilterElements] = useState<string[]>([]);

  const slots = VOCATION_SLOTS[vocation];

  const activeSlotDef = slots.find((s) => s.key === activeSlot) ?? slots[0];

  const allItems = useMemo(() => {
    return activeSlotDef.itemTypes.flatMap((type) => {
      const section = imbuableItems[type];
      return section ? section.items.map((item) => ({ ...item, _sourceType: type })) : [];
    });
  }, [activeSlotDef]);

  const hasProtections = useMemo(() => {
    return allItems.some((item) => item.elements && item.elements.length > 0);
  }, [allItems]);

  const filteredItems = useMemo(() => {
    if (filterElements.length === 0) return allItems;
    return allItems.filter((item) => {
      if (!item.elements) return false;
      return filterElements.some((el) => item.elements!.includes(el));
    });
  }, [allItems, filterElements]);

  const toggleElement = (el: string) => {
    setFilterElements((prev) =>
      prev.includes(el) ? prev.filter((e) => e !== el) : [...prev, el],
    );
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap gap-2'>
        {VOCATIONS.map((v) => {
          const active = v.id === vocation;
          return (
            <button
              key={v.id}
              onClick={() => { setVocation(v.id); setActiveSlot(slots[0]?.key ?? 'helmet'); setFilterElements([]); }}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              <img src={v.icon} alt={v.name} className='size-5' />
              {v.name}
            </button>
          );
        })}
      </div>

      <Separator />

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 border-b'>
        {slots.map((slot) => {
          const active = slot.key === activeSlot;
          return (
            <button
              key={slot.key}
              onClick={() => { setActiveSlot(slot.key); setFilterElements([]); }}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>

      {hasProtections && (
        <div className='flex flex-wrap gap-1.5'>
          <span className='text-xs text-muted-foreground self-center mr-1'>
            {te('protectionFilter')}:
          </span>
          {ALL_ELEMENTS.map((el) => {
            const active = filterElements.includes(el);
            return (
              <button
                key={el}
                onClick={() => toggleElement(el)}
                className={`px-2 py-0.5 rounded text-xs font-medium border cursor-pointer transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent'
                }`}
              >
                {ELEMENT_LABELS[el]}
              </button>
            );
          })}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <p className='text-sm text-muted-foreground py-4 text-center'>
          {filterElements.length > 0 ? te('noMatch') : te('noItems')}
        </p>
      ) : (
        <div className='rounded-md border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b bg-muted/50'>
                <th className='px-3 py-2 text-left font-medium'>{te('item')}</th>
                <th className='px-3 py-2 text-center font-medium'>{te('slots')}</th>
                <th className='px-3 py-2 text-center font-medium'>{te('protection')}</th>
                <th className='px-3 py-2 text-left font-medium'>{te('availableImbuements')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const imbueKeys = imbuingsAvailableByType[item._sourceType as keyof typeof imbuingsAvailableByType] ?? [];
                const showImbues = imbueKeys.slice(0, 3);
                return (
                  <tr key={`${item._sourceType}-${item.name}`} className='border-b last:border-0 hover:bg-muted/30'>
                    <td className='px-3 py-2 font-medium'>{item.name}</td>
                    <td className='px-3 py-2 text-center tabular-nums'>{item.imbuingSlots}</td>
                    <td className='px-3 py-2 text-center'>
                      {item.elements && item.elements.length > 0 ? (
                        <div className='flex flex-wrap gap-1 justify-center'>
                          {item.elements.map((el) => (
                            <Badge
                              key={el}
                              variant="outline"
                            >
                              {ELEMENT_LABELS[el] ?? el}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className='text-xs text-muted-foreground'>—</span>
                      )}
                    </td>
                    <td className='px-3 py-2'>
                      <div className='flex flex-wrap gap-1'>
                        {showImbues.map((ik) => {
                          const imbue = imbuements[ik as keyof typeof imbuements];
                          if (!imbue) return null;
                          return (
                            <Badge
                              key={ik}
                              variant="outline"
                            >
                              {imbue.name}
                            </Badge>
                          );
                        })}
                        {imbueKeys.length > 3 && (
                          <span className='text-xs text-muted-foreground'>+{imbueKeys.length - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
