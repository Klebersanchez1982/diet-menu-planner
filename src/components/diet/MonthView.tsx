import { format, addDays, isSameMonth, getDay } from 'date-fns';
import { MEAL_PERIODS, MealPeriod, WeekData, WEEKDAY_LABELS } from '@/types/diet';
import { MealPeriodCard } from './MealPeriodCard';

interface Props {
  monthWeekStarts: Date[];
  currentDate: Date;
  data: WeekData;
  onAdd: (dateKey: string, period: MealPeriod, item: { description: string; unit: string; quantity: string }) => void;
  onRemove: (dateKey: string, period: MealPeriod, itemId: string) => void;
  onToggle: (dateKey: string, period: MealPeriod, itemId: string) => void;
}

export function MonthView({ monthWeekStarts, currentDate, data, onAdd, onRemove, onToggle }: Props) {
  return (
    <div className="space-y-4 overflow-x-auto">
      <div className="grid grid-cols-5 gap-1 min-w-[700px]">
        {WEEKDAY_LABELS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground uppercase py-1">{d}</div>
        ))}
      </div>
      {monthWeekStarts.map(weekStart => {
        // weekStart is Monday, get Mon-Fri
        const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
        return (
          <div key={weekStart.toISOString()} className="grid grid-cols-5 gap-1 min-w-[700px]">
            {days.map(date => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const dayMeals = data[dateKey] || {};
              const inMonth = isSameMonth(date, currentDate);
              const isToday = format(new Date(), 'yyyy-MM-dd') === dateKey;

              return (
                <div
                  key={dateKey}
                  className={`rounded-lg border p-1.5 space-y-1 min-h-[120px] ${
                    !inMonth ? 'opacity-40' : ''
                  } ${isToday ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                >
                  <div className={`text-xs font-bold text-center ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {format(date, 'dd')}
                  </div>
                  {MEAL_PERIODS.map(mp => {
                    const items = dayMeals[mp.key] || [];
                    if (items.length === 0 && !inMonth) return null;
                    return (
                      <MealPeriodCard
                        key={mp.key}
                        period={mp.key}
                        items={items}
                        dateKey={dateKey}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        onToggle={onToggle}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
