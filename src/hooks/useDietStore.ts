import { useState, useCallback } from 'react';
import { WeekData, MealItem, MealPeriod, MEAL_PERIODS } from '@/types/diet';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachWeekOfInterval, getDay } from 'date-fns';

const STORAGE_KEY = 'diet-calendar-data';

function loadData(): WeekData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveData(data: WeekData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Returns Mon-Fri dates for the week containing `date` */
function getWeekdaysOfWeek(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  return Array.from({ length: 5 }, (_, i) => addDays(start, i));
}

export function useDietStore() {
  const [data, setData] = useState<WeekData>(loadData);

  const updateData = useCallback((updater: (prev: WeekData) => WeekData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const addMealItem = useCallback((dateKey: string, period: MealPeriod, item: Omit<MealItem, 'id' | 'completed'>) => {
    updateData(prev => {
      const dayMeals = prev[dateKey] || {};
      const periodMeals = dayMeals[period] || [];
      return {
        ...prev,
        [dateKey]: {
          ...dayMeals,
          [period]: [...periodMeals, { ...item, id: crypto.randomUUID(), completed: false }],
        },
      };
    });
  }, [updateData]);

  const removeMealItem = useCallback((dateKey: string, period: MealPeriod, itemId: string) => {
    updateData(prev => {
      const dayMeals = prev[dateKey] || {};
      const periodMeals = (dayMeals[period] || []).filter(i => i.id !== itemId);
      return { ...prev, [dateKey]: { ...dayMeals, [period]: periodMeals } };
    });
  }, [updateData]);

  const toggleCompleted = useCallback((dateKey: string, period: MealPeriod, itemId: string) => {
    updateData(prev => {
      const dayMeals = prev[dateKey] || {};
      const periodMeals = (dayMeals[period] || []).map(i =>
        i.id === itemId ? { ...i, completed: !i.completed } : i
      );
      return { ...prev, [dateKey]: { ...dayMeals, [period]: periodMeals } };
    });
  }, [updateData]);

  const getWeekDates = useCallback((date: Date) => {
    return getWeekdaysOfWeek(date);
  }, []);

  const getMonthWeeks = useCallback((date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });
  }, []);

  const getShoppingList = useCallback((dateKeys: string[]) => {
    const map = new Map<string, { unit: string; quantity: number }>();
    for (const dk of dateKeys) {
      const dayMeals = data[dk];
      if (!dayMeals) continue;
      for (const period of MEAL_PERIODS) {
        const items = dayMeals[period.key] || [];
        for (const item of items) {
          const key = `${item.description.toLowerCase()}|${item.unit.toLowerCase()}`;
          const existing = map.get(key);
          const qty = parseFloat(item.quantity) || 0;
          if (existing) {
            existing.quantity += qty;
          } else {
            map.set(key, { unit: item.unit, quantity: qty });
          }
        }
      }
    }
    return Array.from(map.entries()).map(([key, val]) => {
      const [description] = key.split('|');
      return { description, unit: val.unit, quantity: val.quantity };
    }).sort((a, b) => a.description.localeCompare(b.description));
  }, [data]);

  return { data, addMealItem, removeMealItem, toggleCompleted, getWeekDates, getMonthWeeks, getShoppingList };
}
