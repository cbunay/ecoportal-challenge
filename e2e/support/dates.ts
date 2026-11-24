import { TZDate } from "@date-fns/tz";
import {
  addDays,
  addWeeks,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

import { testTimeZone } from "../../src/lib/defaults";

const now = TZDate.tz(testTimeZone);

function describeDay(day: Date) {
  return {
    input: format(day, "yyyy-MM-dd"),
    label: format(day, "EEEE, MMMM d"),
    month: format(day, "MMMM yyyy"),
  };
}

export type Day = ReturnType<typeof describeDay>;

export const today = describeDay(now);

function daysOfWeek(weekOffset: number) {
  const start = startOfWeek(addWeeks(now, weekOffset));
  return Array.from({ length: 7 }, (_, index) =>
    describeDay(addDays(start, index)),
  );
}

export const weekDays = daysOfWeek(0);

export const otherWeekDays = (() => {
  for (const offset of [-1, 1, -2, 2]) {
    const days = daysOfWeek(offset);
    if (days.slice(0, 3).every((day) => day.month === today.month)) return days;
  }
  throw new Error("No other week with three days in the current month");
})();

const monthFirst = startOfMonth(now);
const monthLast = endOfMonth(now);
export const firstDay = describeDay(monthFirst);
export const lastDay = describeDay(monthLast);

export const crossMonth = (() => {
  if (getDay(monthLast) !== 6) {
    return { before: lastDay, after: describeDay(addDays(monthLast, 1)) };
  }
  if (getDay(monthFirst) !== 0) {
    return { before: describeDay(subDays(monthFirst, 1)), after: firstDay };
  }
  return null;
})();
