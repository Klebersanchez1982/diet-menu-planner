import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WeekData, MEAL_PERIODS, WEEKDAY_LABELS_FULL } from '@/types/diet';

export function exportWeekPdf(weekDates: Date[], data: WeekData) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const title = `Cardápio Semanal — ${format(weekDates[0], "dd/MM")} a ${format(weekDates[6], "dd/MM/yyyy")}`;
  doc.setFontSize(14);
  doc.text(title, 148, 12, { align: 'center' });

  const head = [['Período', ...weekDates.map((d, i) => `${WEEKDAY_LABELS_FULL[i]}\n${format(d, 'dd/MM')}`)]];
  const body = MEAL_PERIODS.map(mp => {
    const row = [mp.label];
    for (const date of weekDates) {
      const dk = format(date, 'yyyy-MM-dd');
      const items = (data[dk]?.[mp.key] || []);
      const cell = items.map(it => {
        const check = it.completed ? '✓' : '○';
        return `${check} ${it.description} ${it.quantity ? `(${it.quantity} ${it.unit})` : ''}`;
      }).join('\n') || '—';
      row.push(cell);
    }
    return row;
  });

  autoTable(doc, {
    head,
    body,
    startY: 18,
    styles: { fontSize: 7, cellPadding: 2, valign: 'top', overflow: 'linebreak' },
    headStyles: { fillColor: [56, 124, 80], fontSize: 7, halign: 'center' },
    columnStyles: { 0: { cellWidth: 28, fontStyle: 'bold' } },
    theme: 'grid',
    margin: { left: 8, right: 8 },
  });

  doc.save(`cardapio-semana-${format(weekDates[0], 'yyyy-MM-dd')}.pdf`);
}

export function exportShoppingListPdf(items: { description: string; unit: string; quantity: number }[], label: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.setFontSize(14);
  doc.text(`Lista de Compras — ${label}`, 148, 12, { align: 'center' });

  const third = Math.ceil(items.length / 3);
  const cols = [items.slice(0, third), items.slice(third, third * 2), items.slice(third * 2)];

  const maxRows = Math.max(...cols.map(c => c.length));
  const body: string[][] = [];
  for (let r = 0; r < maxRows; r++) {
    const row: string[] = [];
    for (const col of cols) {
      const item = col[r];
      row.push(item ? item.description : '');
      row.push(item ? `${item.quantity} ${item.unit}` : '');
    }
    body.push(row);
  }

  autoTable(doc, {
    head: [['Item', 'Qtd', 'Item', 'Qtd', 'Item', 'Qtd']],
    body,
    startY: 18,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [56, 124, 80] },
    theme: 'grid',
    margin: { left: 10, right: 10 },
  });

  doc.save(`lista-compras-${label.toLowerCase().replace(/\s/g, '-')}.pdf`);
}
