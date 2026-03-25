import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShoppingCart, FileDown } from 'lucide-react';
import { exportShoppingListPdf } from './PdfExport';

interface ShoppingItem {
  description: string;
  unit: string;
  quantity: number;
}

interface Props {
  items: ShoppingItem[];
  label: string;
}

export function ShoppingList({ items, label }: Props) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (desc: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(desc)) next.delete(desc);
      else next.add(desc);
      return next;
    });
  };

  // Sort: unchecked first (alphabetical), then checked (alphabetical)
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aChecked = checkedItems.has(a.description);
      const bChecked = checkedItems.has(b.description);
      if (aChecked !== bChecked) return aChecked ? 1 : -1;
      return a.description.localeCompare(b.description);
    });
  }, [items, checkedItems]);

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            Lista de Compras — {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">Adicione itens ao cardápio para gerar a lista.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            Lista de Compras — {label}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => exportShoppingListPdf(
              sortedItems.map(i => ({ ...i, checked: checkedItems.has(i.description) })),
              label
            )}
          >
            <FileDown className="h-3.5 w-3.5" /> PDF
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
          {sortedItems.map((item, i) => {
            const checked = checkedItems.has(item.description);
            return (
              <label
                key={`${item.description}-${i}`}
                className={`flex items-center gap-2 text-sm py-1.5 px-2 rounded cursor-pointer transition-colors ${
                  checked ? 'bg-muted/50' : 'bg-secondary'
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleCheck(item.description)}
                  className="h-4 w-4"
                />
                <span className={`font-medium capitalize flex-1 ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {item.description}
                </span>
                <span className={`whitespace-nowrap ${checked ? 'text-muted-foreground/60 line-through' : 'text-muted-foreground'}`}>
                  {item.quantity} {item.unit}
                </span>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
