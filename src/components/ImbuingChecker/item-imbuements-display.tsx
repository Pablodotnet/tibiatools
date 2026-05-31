import { useTranslation } from "react-i18next";
import { imbuements, imbuingsAvailableByType, elementBlockedImbuements } from "./imbuements";
import { imbuableItems } from "@/helpers/ImbuingLists/imbuableItems";
import { Card } from "@/components/ui/card";
import { getImbuementIcon } from "@/helpers";
import { Label } from "@/components/ui/label";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Ban, ChevronDown, ChevronUp, Package } from "lucide-react";

type ItemType = keyof typeof imbuingsAvailableByType;

interface ItemImbuementsDisplayProps {
  selectedSearch: {
    type: string | null;
    item: string | null;
  } | null;
}

const ItemImbuementsDisplay: React.FC<ItemImbuementsDisplayProps> = ({
  selectedSearch,
}) => {
  const { t } = useTranslation();
  const ti = (key: string) => t(`imbuingChecker.${key}`);
  const itemType = (selectedSearch?.type || "") as ItemType;
  const itemName = selectedSearch?.item || '';

  const itemElements = React.useMemo(() => {
    if (!itemType || !itemName) return undefined;
    const section = imbuableItems[itemType];
    if (!section) return undefined;
    return section.items.find((i) => i.name === itemName)?.elements;
  }, [itemType, itemName]);

  const blockedImbuements = React.useMemo(() => {
    if (!itemElements) return new Set<string>();
    const set = new Set<string>();
    for (const el of itemElements) {
      const ids = elementBlockedImbuements[el];
      if (ids) ids.forEach((id) => set.add(id));
    }
    return set;
  }, [itemElements]);

  const availableImbuementsForItem = imbuingsAvailableByType[
    itemType
  ] as (keyof typeof imbuements)[];

  return selectedSearch ? (
    <>
      {itemElements && itemElements.length > 0 && (
        <p className="text-xs text-muted-foreground mb-2">
          {t('imbuingChecker.conflictMsg', { elements: itemElements.join(', ') })}
        </p>
      )}
      <Label>{ti('youCanImbue')}</Label>
      {availableImbuementsForItem && availableImbuementsForItem.length > 0 && (
        <div className="mt-2 space-y-3">
          {availableImbuementsForItem.map(
            (imbuement: keyof typeof imbuements) => {
              const isBlocked = blockedImbuements.has(imbuement);
              return (
                <ImbuementCard
                  key={imbuement}
                  imbuement={imbuement}
                  isBlocked={isBlocked}
                />
              );
            }
          )}
        </div>
      )}
    </>
  ) : (
    <h3 className="text-destructive font-medium" role="alert">
      {ti('errorNoSearch')}
    </h3>
  );
};

interface ImbuementCardProps {
  imbuement: keyof typeof imbuements;
  isBlocked: boolean;
}

const ImbuementCard: React.FC<ImbuementCardProps> = ({ imbuement, isBlocked }) => {
  const { t } = useTranslation();
  const ti = (key: string) => t(`imbuingChecker.${key}`);
  const [open, setOpen] = React.useState(false);
  const data = imbuements[imbuement];

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Card className={`px-4 py-3 ${isBlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50 transition-colors'}`}>
          <div className="w-full flex items-center gap-4">
            <img
              src={getImbuementIcon(data.icon)}
              alt={data.name}
              className="w-10 h-10 shrink-0"
            />
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {data.name}
                </h4>
                {isBlocked && <Ban className="size-4 text-destructive shrink-0" />}
              </div>
              <small className="text-sm font-medium leading-none text-muted-foreground">
                {data.effect}
                {isBlocked && (
                  <span className="text-destructive ml-2">{ti('conflictsWithElement')}</span>
                )}
              </small>
            </div>
            {!isBlocked && (
              <div className="shrink-0 text-muted-foreground">
                {open ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </div>
            )}
          </div>
        </Card>
      </Collapsible.Trigger>
      {!isBlocked && (
        <Collapsible.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <Card className="mt-0.5 px-4 py-3 border-t-0 rounded-t-none">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["basic", "intricate", "powerful"] as const).map((type) => (
                <div key={type}>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Package className="size-3" />
                    {type}
                  </h5>
                  <ul className="space-y-1.5">
                    {data[type].map((item) => (
                      <li
                        key={item.itemName}
                        className="flex items-center gap-2 text-sm"
                      >
                        {item.icon && (
                          <img
                            src={item.icon}
                            alt={item.itemName}
                            className="w-7 h-7 shrink-0"
                          />
                        )}
                        <span className="flex-1 min-w-0 truncate">{item.itemName}</span>
                        <span className="tabular-nums text-muted-foreground shrink-0">
                          x{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </Collapsible.Content>
      )}
    </Collapsible.Root>
  );
};

export default ItemImbuementsDisplay;
