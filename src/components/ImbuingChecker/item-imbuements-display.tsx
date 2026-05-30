import React from "react";
import { imbuements, imbuingsAvailableByType, elementBlockedImbuements } from "./imbuements";
import { imbuableItems } from "@/helpers/ImbuingLists/imbuableItems";
import { Card } from "@/components/ui/card";
import { getImbuementIcon } from "@/helpers";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
import { Ban } from "lucide-react";

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
          This item has <span className="font-medium">{itemElements.join(', ')}</span> — conflicting imbuements are blocked.
        </p>
      )}
      <Label>You can imbue:</Label>
      {availableImbuementsForItem && availableImbuementsForItem.length > 0 && (
        <div>
          {availableImbuementsForItem.map(
            (imbuement: keyof typeof imbuements) => {
              const isBlocked = blockedImbuements.has(imbuement);
              return (
                <HoverCard key={imbuement}>
                  <HoverCardTrigger asChild>
                    <Card className={`px-4 mb-4 py-2 ${isBlocked ? 'opacity-40 cursor-not-allowed' : ''}`}>
                      <div className="w-full flex items-center">
                        <img
                          src={getImbuementIcon(imbuements[imbuement].icon)}
                          alt={imbuements[imbuement].name}
                          className="w-10 h-10 mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                              {imbuements[imbuement].name}
                            </h4>
                            {isBlocked && <Ban className="size-4 text-destructive" />}
                          </div>
                          <small className="text-sm font-medium leading-none">
                            {imbuements[imbuement].effect}
                            {isBlocked && <span className="text-destructive ml-2">(conflicts with item element)</span>}
                          </small>
                        </div>
                      </div>
                    </Card>
                  </HoverCardTrigger>
                  {!isBlocked && (
                    <HoverCardContent className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm px-4 mb-4 py-2 w-full">
                      {(["basic", "intricate", "powerful"] as const).map((type) => (
                        <div
                          className="w-full"
                          key={`type-${imbuements[imbuement].name}-${type}`}
                        >
                          <p className="text-sm">{type.toUpperCase()}</p>
                          {imbuements[imbuement][type].map((item) => (
                            <Card
                              className="w-full flex px-4 mb-1 py-1 items-center"
                              key={item.itemName}
                            >
                              {item.icon && (
                                <img
                                  src={item.icon}
                                  alt={item.itemName}
                                  className="w-10 h-10"
                                />
                              )}
                              <p>{item.itemName}</p>
                              <p>{item.quantity}</p>
                            </Card>
                          ))}
                        </div>
                      ))}
                    </HoverCardContent>
                  )}
                </HoverCard>
              );
            }
          )}
        </div>
      )}
    </>
  ) : (
    <h3 className="text-destructive font-medium" role="alert">
      Error, missing selected search.
    </h3>
  );
};

export default ItemImbuementsDisplay;
