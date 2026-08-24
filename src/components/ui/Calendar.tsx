"use client";

import { useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

interface CalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const Calendar: React.FC<CalendarProps> = ({ value, onChange }) => {
  const [viewDate, setViewDate] = useState(() => value ?? new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
  }

  const changeMonth = (delta: number) => setViewDate(new Date(year, month + delta, 1));

  return (
    <div className="rounded-input border border-border p-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">
          <ArrowLeft2 size={18} color="#171717" variant="Linear" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[month]} {year}
        </span>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
          <ArrowRight2 size={18} color="#171717" variant="Linear" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAYS.map((day, i) => (
          <span key={i} className="text-xs font-medium text-muted">
            {day}
          </span>
        ))}
        {cells.map(({ date, inMonth }, i) => {
          const selected = value && isSameDay(date, value);
          return (
            <button
              key={i}
              type="button"
              disabled={!inMonth}
              onClick={() => onChange(date)}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                selected
                  ? "bg-primary/40 font-semibold text-foreground"
                  : inMonth
                    ? "text-foreground hover:bg-zinc-100"
                    : "text-zinc-300"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
