import { useState, useCallback, useMemo } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { useTransactionsStore, selectTransactions } from '../../store';

interface DatePickerSheetProps {
  open: boolean;
  onClose: () => void;
  dateFrom: string | null;
  dateTo: string | null;
  onApply: (from: string | null, to: string | null) => void;
}

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function toISOStart(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00Z`;
}

function toISOEnd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T23:59:59Z`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false;
  const t = day.getTime();
  const f = from.getTime();
  const e = to.getTime();
  return t >= Math.min(f, e) && t <= Math.max(f, e);
}

interface CalendarDay {
  date: Date;
  currentMonth: boolean;
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;

  const days: CalendarDay[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, currentMonth: false });
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), currentMonth: true });
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), currentMonth: false });
  }

  return days;
}

export function DatePickerSheet({ open, onClose, dateFrom, dateTo, onApply }: DatePickerSheetProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [selFrom, setSelFrom] = useState<Date | null>(dateFrom ? new Date(dateFrom) : null);
  const [selTo, setSelTo] = useState<Date | null>(dateTo ? new Date(dateTo) : null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open && !prevOpen) {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelFrom(dateFrom ? new Date(dateFrom) : null);
    setSelTo(dateTo ? new Date(dateTo) : null);
    setSelectingEnd(false);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const transactions = useTransactionsStore(selectTransactions);

  const txDaySet = useMemo(() => {
    const set = new Set<string>();
    for (const tx of transactions) {
      const d = new Date(tx.date_timestamp * 1000);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    }
    return set;
  }, [transactions]);

  const txDayCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of transactions) {
      const d = new Date(tx.date_timestamp * 1000);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [transactions]);

  const days = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const handlePrev = useCallback(() => {
    setViewYear((y) => {
      const newMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const newYear = viewMonth === 0 ? y - 1 : y;
      setViewMonth(newMonth);
      return newYear;
    });
  }, [viewMonth]);

  const handleNext = useCallback(() => {
    setViewYear((y) => {
      const newMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const newYear = viewMonth === 11 ? y + 1 : y;
      setViewMonth(newMonth);
      return newYear;
    });
  }, [viewMonth]);

  const handleDayClick = useCallback(
    (day: Date) => {
      if (!selectingEnd || !selFrom) {
        setSelFrom(day);
        setSelTo(null);
        setSelectingEnd(true);
      } else {
        if (day.getTime() < selFrom.getTime()) {
          setSelTo(selFrom);
          setSelFrom(day);
        } else {
          setSelTo(day);
        }
        setSelectingEnd(false);
      }
    },
    [selectingEnd, selFrom],
  );

  const handleApply = useCallback(() => {
    const from = selFrom ? toISOStart(selFrom) : null;
    const to = selTo ? toISOEnd(selTo) : (selFrom ? toISOEnd(selFrom) : null);
    onApply(from, to);
    onClose();
  }, [selFrom, selTo, onApply, onClose]);

  const handleReset = useCallback(() => {
    setSelFrom(null);
    setSelTo(null);
    setSelectingEnd(false);
    onApply(null, null);
    onClose();
  }, [onApply, onClose]);

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex flex-col bg-[#0A080F] rounded-[24px] overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between p-4 bg-[#221C33]">
          <button
            onClick={handlePrev}
            className="flex items-center justify-center p-1 border border-[#787880]/15 rounded-[8px] active:scale-95 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-white font-medium text-base">
            {MONTHS_RU[viewMonth]}, {viewYear}
          </span>
          <button
            onClick={handleNext}
            className="flex items-center justify-center p-1 border border-[#787880]/15 rounded-[8px] active:scale-95 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-0 p-4">
          {WEEKDAYS.map((w) => (
            <div key={w} className="flex items-center justify-center py-1">
              <span className="text-text-hint text-xs font-medium">{w}</span>
            </div>
          ))}

          {/* Days */}
          {days.map((day, i) => {
            const isToday = isSameDay(day.date, today);
            const isStart = selFrom && isSameDay(day.date, selFrom);
            const isEnd = selTo && isSameDay(day.date, selTo);
            const isSelected = isStart || isEnd;
            const inRange = isInRange(day.date, selFrom, selTo) && !isSelected;
            const hasRange = selFrom && selTo;

            const dayKey = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
            const hasTx = txDaySet.has(dayKey);
            const txCount = txDayCounts.get(dayKey) ?? 0;

            let rounded = 'rounded-[8px]';
            if (hasRange) {
              if (isStart && isEnd) {
                rounded = 'rounded-[8px]';
              } else if (isStart) {
                rounded = 'rounded-l-[8px] rounded-r-none';
              } else if (isEnd) {
                rounded = 'rounded-r-[8px] rounded-l-none';
              } else if (inRange) {
                rounded = 'rounded-none';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleDayClick(day.date)}
                className={`flex flex-col items-center justify-center aspect-square ${rounded} text-sm transition-colors relative ${
                  !day.currentMonth
                    ? 'text-white/20'
                    : isSelected
                      ? 'bg-primary text-white font-semibold'
                      : inRange
                        ? 'bg-primary/20 text-white'
                        : isToday
                          ? 'text-primary font-semibold'
                          : 'text-white'
                } active:scale-95`}
              >
                <span>{day.date.getDate()}</span>
                {hasTx && day.currentMonth && (
                  <div className="flex gap-0.5 absolute bottom-1">
                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/60' : 'bg-white/40'}`} />
                    {txCount > 1 && (
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/40' : 'bg-white/25'}`} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          {(selFrom || selTo) && (
            <button
              onClick={handleReset}
              className="flex-1 p-3 rounded-lg bg-white/[0.06] text-white font-medium text-sm active:scale-[0.97] transition-transform"
            >
              Сбросить
            </button>
          )}
          <button
            onClick={handleApply}
            className="flex-1 p-3 rounded-lg bg-primary text-white font-medium text-sm active:scale-[0.97] transition-transform"
          >
            Применить
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
