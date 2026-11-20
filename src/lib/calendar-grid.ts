import { tz } from "@date-fns/tz";
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isValid,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { calendarTimeZone } from "@/lib/defaults";

const inTimeZone = tz(calendarTimeZone);

const weekOptions = { in: inTimeZone, weekStartsOn: 0 as const };

export enum CalendarView {
  Month = "month",
  Week = "week",
}

function dayKey(date: Date) {
  return format(date, "yyyy-MM-dd", { in: inTimeZone });
}

function dayLabel(date: Date) {
  const day = format(date, "d", { in: inTimeZone });

  return day === "1" ? format(date, "MMM d", { in: inTimeZone }) : day;
}

export type MonthDay = {
  key: string;
  weekday: string;
  label: string;
  inMonth: boolean;
  isToday: boolean;
};

export function buildMonthWeeks(reference: Date, today: Date = reference) {
  const monthStart = startOfMonth(reference, { in: inTimeZone });
  const gridStart = startOfWeek(monthStart, weekOptions);
  const gridEnd = endOfWeek(
    endOfMonth(reference, { in: inTimeZone }),
    weekOptions,
  );
  const days = eachDayOfInterval(
    { start: gridStart, end: gridEnd },
    { in: inTimeZone },
  );

  const weeks: MonthDay[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(
      days.slice(index, index + 7).map((day) => ({
        key: dayKey(day),
        weekday: format(day, "EEE", { in: inTimeZone }).toUpperCase(),
        label: dayLabel(day),
        inMonth: isSameMonth(day, monthStart, { in: inTimeZone }),
        isToday: isSameDay(day, today, { in: inTimeZone }),
      })),
    );
  }

  return weeks;
}

export type WeekDay = {
  key: string;
  weekday: string;
  label: string;
  isToday: boolean;
};

export function buildWeekDays(reference: Date, today: Date = reference) {
  const start = startOfWeek(reference, weekOptions);
  const end = endOfWeek(reference, weekOptions);

  return eachDayOfInterval({ start, end }, { in: inTimeZone }).map((day) => ({
    key: dayKey(day),
    weekday: format(day, "EEE", { in: inTimeZone }).toUpperCase(),
    label: format(day, "d", { in: inTimeZone }),
    isToday: isSameDay(day, today, { in: inTimeZone }),
  }));
}

export function weekHourLabels() {
  return Array.from({ length: 24 }, (_, index) =>
    format(new Date(2026, 0, 1, index), "h a"),
  );
}

export function timeZoneOffsetLabel(reference: Date) {
  return format(reference, "O", { in: inTimeZone });
}

export function formatPeriodLabel(reference: Date, view: CalendarView) {
  if (view === CalendarView.Month) {
    return format(reference, "MMMM yyyy", { in: inTimeZone });
  }

  const start = startOfWeek(reference, weekOptions);
  const end = endOfWeek(reference, weekOptions);
  const startLabel = format(start, "MMM yyyy", { in: inTimeZone });
  const endLabel = format(end, "MMM yyyy", { in: inTimeZone });

  if (startLabel === endLabel) {
    return format(start, "MMMM yyyy", { in: inTimeZone });
  }

  return `${startLabel} – ${endLabel}`;
}

export function shiftPeriod(
  reference: Date,
  view: CalendarView,
  amount: number,
) {
  return view === CalendarView.Week
    ? addWeeks(reference, amount, { in: inTimeZone })
    : addMonths(reference, amount, { in: inTimeZone });
}

export function formatDateParam(date: Date) {
  return dayKey(date);
}

export function parseDateParam(param: string | null, fallback: Date) {
  if (!param) return fallback;

  const parsed = parse(param, "yyyy-MM-dd", fallback, { in: inTimeZone });

  return isValid(parsed) ? parsed : fallback;
}
