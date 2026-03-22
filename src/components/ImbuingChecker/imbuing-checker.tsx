import { imbuableItems } from "@/helpers/ImbuingLists";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import ItemImbuementsDisplay from "./item-imbuements-display";

export const ImbuingChecker = () => {
  const itemsTypes = Object.keys(imbuableItems);
  const [selectedItemType, setSelectedItemType] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedSearch, setSelectedSearch] = useState<{
    type: string | null;
    item: string | null;
  } | null>(null);

  const handleSelectItemType = (type: string) => {
    setSelectedItemType(type);
    setSelectedItem(null); // Reset item selection when changing item type
    setSelectedSearch(null);
  };

  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
    setSelectedSearch({ type: selectedItemType, item });
  };

  const handleCancel = () => {
    setSelectedItemType(null);
    setSelectedItem(null);
    setSelectedSearch(null);
  };

  return (
    <>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="item_type">Item type</Label>
            <Select
              onValueChange={handleSelectItemType}
              value={selectedItemType || ""}
            >
              <SelectTrigger id="item_type">
                <SelectValue placeholder="Select the type" />
              </SelectTrigger>
              <SelectContent position="popper">
                {itemsTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {imbuableItems[type].displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedItemType && (
              <>
                <Label htmlFor="type_options">Item</Label>
                <Select
                  onValueChange={handleSelectItem}
                  value={selectedItem || ""}
                >
                  <SelectTrigger id="type_options">
                    <SelectValue placeholder="Select the item" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {imbuableItems[selectedItemType].items.map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {selectedSearch && (
              <ItemImbuementsDisplay selectedSearch={selectedSearch} />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Clear
        </Button>
      </CardFooter>
    </>
  );
};
