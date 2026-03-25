import { format, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileDown, ShoppingCart } from 'lucide-react';

interface Props {
  currentDate: Date;
  view: 'week' | 'month';
  onDateChange: (date: Date) => void;
  onViewChange: (view: 'week' | 'month') => void;
  onExportCalendar: () => void;
  onExportShopping: () => void;
  hasShoppingItems: boolean;
}

export function CalendarHeader({ currentDate, view, onDateChange, onViewChange, onExportCalendar, onExportShopping, hasShoppingItems }: Props) {
  const navigate = (dir: 1 | -1) => {
    if (view === 'week') onDateChange(dir === 1 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    else onDateChange(dir === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const label = view === 'week'
    ? format(currentDate, "'Semana de' dd 'de' MMMM", { locale: ptBR })
    : format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-base sm:text-lg font-bold text-foreground capitalize min-w-[200px] text-center">{label}</h2>
        <Button variant="outline" size="icon" onClick={() => navigate(1)} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="inline-flex rounded-md border border-border">
          <Button
            variant={view === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('week')}
            className="rounded-r-none text-xs"
          >
            Semana
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('month')}
            className="rounded-l-none text-xs"
          >
            Mês
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={onExportCalendar} className="text-xs gap-1.5">
          <FileDown className="h-3.5 w-3.5" /> Exportar Cardápio
        </Button>
        {hasShoppingItems && (
          <Button variant="outline" size="sm" onClick={onExportShopping} className="text-xs gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5" /> Exportar Compras
          </Button>
        )}
      </div>
    </div>
  );
}
