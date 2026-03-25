import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { MealPeriod } from '@/types/diet';

interface Props {
  onAdd: (item: { description: string; unit: string; quantity: string }) => void;
  periodLabel: string;
}

export function AddMealDialog({ onAdd, periodLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onAdd({ description: description.trim(), unit: unit.trim(), quantity: quantity.trim() });
    setDescription('');
    setUnit('');
    setQuantity('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-primary">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Adicionar - {periodLabel}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="desc">Descrição</Label>
            <Input id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Arroz integral" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Input id="unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="Ex: gramas" />
            </div>
            <div>
              <Label htmlFor="qty">Quantidade</Label>
              <Input id="qty" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Ex: 150" />
            </div>
          </div>
          <Button type="submit" className="w-full">Adicionar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
