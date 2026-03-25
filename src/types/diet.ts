export type MealPeriod = 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner';

export const MEAL_PERIODS: { key: MealPeriod; label: string }[] = [
  { key: 'breakfast', label: 'Café da Manhã' },
  { key: 'morning_snack', label: 'Lanche da Manhã' },
  { key: 'lunch', label: 'Almoço' },
  { key: 'afternoon_snack', label: 'Lanche da Tarde' },
  { key: 'dinner', label: 'Jantar' },
];

export interface MealItem {
  id: string;
  description: string;
  unit: string;
  quantity: string;
  completed: boolean;
}

export interface DayMeals {
  [period: string]: MealItem[];
}

export interface WeekData {
  [dateKey: string]: DayMeals; // dateKey = 'YYYY-MM-DD'
}

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WEEKDAY_LABELS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
