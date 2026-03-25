import { MealItem, MealPeriod, MEAL_PERIODS } from '@/types/diet';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AddMealDialog } from './AddMealDialog';
import { cn } from '@/lib/utils';

const PERIOD_COLORS: Record<MealPeriod, string> = {
  breakfast: 'border-l-meal-breakfast',
  morning_snack: 'border-l-meal-morning-snack',
  lunch: 'border-l-meal-lunch',
  afternoon_snack: 'border-l-meal-afternoon-snack',
  dinner: 'border-l-meal-dinner',
};

const PERIOD_BG: Record<MealPeriod, string> = {
  breakfast: 'bg-meal-breakfast/10',
  morning_snack: 'bg-meal-morning-snack/10',
  lunch: 'bg-meal-lunch/10',
  afternoon_snack: 'bg-meal-afternoon-snack/10',
  dinner: 'bg-meal-dinner/10',
};

interface Props {
  period: MealPeriod;
  items: MealItem[];
  dateKey: string;
  onAdd: (dateKey: string, period: MealPeriod, item: { description: string; unit: string; quantity: string }) => void;
  onRemove: (dateKey: string, period: MealPeriod, itemId: string) => void;
  onToggle: (dateKey: string, period: MealPeriod, itemId: string) => void;
}

export function MealPeriodCard({ period, items, dateKey, onAdd, onRemove, onToggle }: Props) {
  const label = MEAL_PERIODS.find(p => p.key === period)!.label;

  return (
    <div className={cn('border-l-3 rounded-md p-2', PERIOD_COLORS[period], PERIOD_BG[period])}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <AddMealDialog periodLabel={label} onAdd={(item) => onAdd(dateKey, period, item)} />
      </div>
      {items.length === 0 && (
        <p className="text-[10px] text-muted-foreground italic">Vazio</p>
      )}
      <ul className="space-y-0.5">
        {items.map(item => (
          <li key={item.id} className="flex items-start gap-1.5 group text-xs">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => onToggle(dateKey, period, item.id)}
              className="mt-0.5 h-3.5 w-3.5"
            />
            <span className={cn('flex-1 leading-tight', item.completed && 'line-through text-muted-foreground')}>
              {item.description}
              {item.quantity && <span className="text-muted-foreground"> — {item.quantity} {item.unit}</span>}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 text-destructive"
              onClick={() => onRemove(dateKey, period, item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
