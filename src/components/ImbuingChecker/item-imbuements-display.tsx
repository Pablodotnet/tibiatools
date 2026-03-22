import React from "react";
import { imbuements, imbuingsAvailableByType } from "./imbuements";
import { Card } from "@/components/ui/card";
import { getImbuementIcon } from "@/helpers";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";

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
  const availableImbuementsForItem = imbuingsAvailableByType[
    itemType
  ] as (keyof typeof imbuements)[];

  return selectedSearch ? (
    <>
      <Label>You can imbue:</Label>
      {availableImbuementsForItem && availableImbuementsForItem.length > 0 && (
        <div>
          {availableImbuementsForItem.map(
            (imbuement: keyof typeof imbuements) => (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Card key={imbuement} className="px-4 mb-4 py-2">
                    <div className="w-full flex items-center">
                      <img
                        src={getImbuementIcon(imbuements[imbuement].icon)}
                        alt={imbuements[imbuement].name}
                        className="w-10 h-10 mr-4"
                      />
                      <div>
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                          {imbuements[imbuement].name}
                        </h4>
                        <small className="text-sm font-medium leading-none">
                          {imbuements[imbuement].effect}
                        </small>
                      </div>
                    </div>
                  </Card>
                </HoverCardTrigger>
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
                  {/* <div className="space-y-2">
                    <p className="text-sm">Basic</p>
                    <Card key={imbuement} className="px-4 mb-4 py-2">
                      <div className="w-full flex items-center">
                        <img
                          src={getImbuementIcon(imbuements[imbuement].icon)}
                          alt={imbuements[imbuement].name}
                          className="w-10 h-10 mr-4"
                        />
                        <div>
                          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            {imbuements[imbuement].name}
                          </h4>
                          <small className="text-sm font-medium leading-none">
                            {imbuements[imbuement].effect}
                          </small>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Intricate</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Powerful</p>
                  </div> */}
                </HoverCardContent>
              </HoverCard>
            )
          )}
        </div>
      )}
    </>
  ) : (
    <>
      <h3>Error, missing selected search.</h3>
    </>
  );
};

export default ItemImbuementsDisplay;
