import { format } from 'date-fns';
import { MEAL_PERIODS, MealPeriod, WeekData, WEEKDAY_LABELS } from '@/types/diet';
import { MealPeriodCard } from './MealPeriodCard';

interface Props {
  weekDates: Date[];
  data: WeekData;
  onAdd: (dateKey: string, period: MealPeriod, item: { description: string; unit: string; quantity: string }) => void;
  onRemove: (dateKey: string, period: MealPeriod, itemId: string) => void;
  onToggle: (dateKey: string, period: MealPeriod, itemId: string) => void;
}

export function WeekView({ weekDates, data, onAdd, onRemove, onToggle }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-5 gap-1 min-w-[700px]">
        {weekDates.map((date, i) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const dayMeals = data[dateKey] || {};
          const isToday = format(new Date(), 'yyyy-MM-dd') === dateKey;

          return (
            <div
              key={dateKey}
              className={`rounded-lg border p-1.5 space-y-1 ${isToday ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
            >
              <div className="text-center pb-1 border-b border-border">
                <div className="text-[10px] font-medium text-muted-foreground uppercase">{WEEKDAY_LABELS[i]}</div>
                <div className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {format(date, 'dd')}
                </div>
              </div>
              {MEAL_PERIODS.map(mp => (
                <MealPeriodCard
                  key={mp.key}
                  period={mp.key}
                  items={dayMeals[mp.key] || []}
                  dateKey={dateKey}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onToggle={onToggle}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
