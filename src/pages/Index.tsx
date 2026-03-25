import { useState, useMemo } from 'react';
import { format, addDays, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { useDietStore } from '@/hooks/useDietStore';
import { CalendarHeader } from '@/components/diet/CalendarHeader';
import { WeekView } from '@/components/diet/WeekView';
import { MonthView } from '@/components/diet/MonthView';
import { ShoppingList } from '@/components/diet/ShoppingList';
import { exportWeekPdf, exportShoppingListPdf } from '@/components/diet/PdfExport';
import { UtensilsCrossed } from 'lucide-react';

export default function Index() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const { data, addMealItem, removeMealItem, toggleCompleted, getWeekDates, getMonthWeeks, getShoppingList } = useDietStore();

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate, getWeekDates]);
  const monthWeekStarts = useMemo(() => getMonthWeeks(currentDate), [currentDate, getMonthWeeks]);

  const shoppingDateKeys = useMemo(() => {
    if (view === 'week') {
      return weekDates.map(d => format(d, 'yyyy-MM-dd'));
    }
    const s = startOfMonth(currentDate);
    const e = endOfMonth(currentDate);
    const keys: string[] = [];
    let d = s;
    while (d <= e) {
      const day = getDay(d);
      if (day >= 1 && day <= 5) keys.push(format(d, 'yyyy-MM-dd'));
      d = addDays(d, 1);
    }
    return keys;
  }, [view, weekDates, currentDate]);

  const shoppingItems = useMemo(() => getShoppingList(shoppingDateKeys), [shoppingDateKeys, getShoppingList]);
  const shoppingLabel = view === 'week'
    ? `Semana ${format(weekDates[0], 'dd/MM')} - ${format(weekDates[6], 'dd/MM')}`
    : format(currentDate, 'MMMM yyyy');

  const handleExportCalendar = () => {
    if (view === 'week') {
      exportWeekPdf(weekDates, data);
    } else {
      // Export each week of the month
      for (const ws of monthWeekStarts) {
        const wd = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
        exportWeekPdf(wd, data);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Meu Cardápio</h1>
            <p className="text-xs text-muted-foreground">Planejamento alimentar semanal</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-4">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onDateChange={setCurrentDate}
          onViewChange={setView}
          onExportCalendar={handleExportCalendar}
          onExportShopping={() => exportShoppingListPdf(shoppingItems, shoppingLabel)}
          hasShoppingItems={shoppingItems.length > 0}
        />

        {view === 'week' ? (
          <WeekView
            weekDates={weekDates}
            data={data}
            onAdd={addMealItem}
            onRemove={removeMealItem}
            onToggle={toggleCompleted}
          />
        ) : (
          <MonthView
            monthWeekStarts={monthWeekStarts}
            currentDate={currentDate}
            data={data}
            onAdd={addMealItem}
            onRemove={removeMealItem}
            onToggle={toggleCompleted}
          />
        )}

        <ShoppingList items={shoppingItems} label={shoppingLabel} />
      </main>
    </div>
  );
}
