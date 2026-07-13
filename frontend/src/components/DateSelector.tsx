"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  addDays,
  format,
  isSameDay,
  isToday,
  parseISO,
  subDays,
} from "date-fns";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  const current = parseISO(selectedDate);

  const goToPrev = () => onDateChange(format(subDays(current, 1), "yyyy-MM-dd"));
  const goToNext = () => onDateChange(format(addDays(current, 1), "yyyy-MM-dd"));
  const goToToday = () => onDateChange(format(new Date(), "yyyy-MM-dd"));

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
      <button
        onClick={goToPrev}
        className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex min-w-[200px] flex-1 flex-col items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-400" />
          <span className="text-lg font-semibold text-white">
            {format(current, "EEEE")}
          </span>
        </div>
        <span className="text-sm text-slate-400">
          {format(current, "MMMM d, yyyy")}
        </span>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="mt-2 w-full cursor-pointer rounded-lg border border-white/10 bg-slate-900/50 px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
        />
      </div>

      <button
        onClick={goToNext}
        className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        aria-label="Next day"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {!isToday(current) && (
        <button
          onClick={goToToday}
          className="rounded-xl bg-indigo-500/20 px-3 py-2 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/30"
        >
          Today
        </button>
      )}

      {isToday(current) && (
        <span className="rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-300">
          Today
        </span>
      )}
    </div>
  );
}

export function isSelectedDate(dateStr: string, selected: string) {
  return isSameDay(parseISO(dateStr), parseISO(selected));
}
