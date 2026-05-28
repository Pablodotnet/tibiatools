import { imbuableItems } from "@/helpers/ImbuingLists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import ItemImbuementsDisplay from "./item-imbuements-display";

export const ImbuingChecker = () => {
  const itemsTypes = Object.keys(imbuableItems);
  const [selectedItemType, setSelectedItemType] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearch, setSelectedSearch] = useState<{
    type: string | null;
    item: string | null;
  } | null>(null);

  const filteredItems = useMemo(() => {
    if (!selectedItemType || !searchQuery.trim()) {
      return selectedItemType ? imbuableItems[selectedItemType].items : [];
    }
    const q = searchQuery.toLowerCase();
    return imbuableItems[selectedItemType].items.filter((item) =>
      item.name.toLowerCase().includes(q),
    );
  }, [selectedItemType, searchQuery]);

  const handleSelectItemType = (type: string) => {
    setSelectedItemType(type);
    setSelectedItem(null);
    setSearchQuery("");
    setSelectedSearch(null);
  };

  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
    setSelectedSearch({ type: selectedItemType, item });
  };

  const handleCancel = () => {
    setSelectedItemType(null);
    setSelectedItem(null);
    setSearchQuery("");
    setSelectedSearch(null);
  };

  return (
    <>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-3">
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
            </div>
            {selectedItemType && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="item_search">Search item</Label>
                <Input
                  id="item_search"
                  placeholder="Type to filter items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Label htmlFor="type_options">Item</Label>
                <Select
                  onValueChange={handleSelectItem}
                  value={selectedItem || ""}
                  disabled={filteredItems.length === 0}
                >
                  <SelectTrigger id="type_options">
                    <SelectValue
                      placeholder={
                        filteredItems.length === 0
                          ? "No items match your search"
                          : "Select the item"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {filteredItems.map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
