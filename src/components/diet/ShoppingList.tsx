import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

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
        <CardTitle className="text-sm flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Lista de Compras — {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm py-1 px-2 rounded bg-secondary">
              <span className="font-medium text-foreground capitalize">{item.description}</span>
              <span className="text-muted-foreground ml-auto whitespace-nowrap">
                {item.quantity} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
