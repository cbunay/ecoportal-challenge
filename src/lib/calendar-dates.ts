import { tz, TZDate } from "@date-fns/tz";
import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { calendarTimeZone } from "@/lib/defaults";

const inTimeZone = tz(calendarTimeZone);
export const zone = { in: inTimeZone };
const weekOptions = { in: inTimeZone, weekStartsOn: 0 as const };
export const dateFormat = "yyyy-MM-dd";
const dateTimeInputFormat = "yyyy-MM-dd'T'HH:mm";

export enum CalendarView {
  Month = "month",
  Week = "week",
}

export function formatInZone(date: Date, pattern: string) {
  return format(date, pattern, zone);
}

export function tzDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minutes = 0,
  seconds = 0,
) {
  return new TZDate(
    year,
    month - 1,
    day,
    hour,
    minutes,
    seconds,
    calendarTimeZone,
  );
}

export function toIso(date: Date) {
  return new Date(date.getTime()).toISOString();
}

export function weekRange(reference: Date) {
  return {
    start: startOfWeek(reference, weekOptions),
    end: endOfWeek(reference, weekOptions),
  };
}

export function monthRange(reference: Date) {
  const monthStart = startOfMonth(reference, zone);
  const monthEnd = endOfMonth(reference, zone);

  return {
    monthStart,
    start: startOfWeek(monthStart, weekOptions),
    end: endOfWeek(monthEnd, weekOptions),
  };
}

export function getGmtOffsetLabel(reference: Date) {
  return formatInZone(reference, "O");
}

export function getToolbarTitle(reference: Date, view: CalendarView) {
  if (view === CalendarView.Month) {
    return formatInZone(reference, "MMMM yyyy");
  }

  const { start, end } = weekRange(reference);
  const startMonth = formatInZone(start, "MMM yyyy");
  const endMonth = formatInZone(end, "MMM yyyy");

  if (startMonth === endMonth) return formatInZone(start, "MMMM yyyy");

  return `${startMonth} – ${endMonth}`;
}

export function shiftPeriod(
  reference: Date,
  view: CalendarView,
  amount: number,
) {
  if (view === CalendarView.Week) return addWeeks(reference, amount, zone);

  return addMonths(reference, amount, zone);
}

export function parseDateParam(param: string | null) {
  const today = startOfDay(new Date(), zone);
  if (!param) return today;

  const parsed = parse(param, dateFormat, today, zone);
  return isValid(parsed) ? parsed : today;
}

export function formatDayLabel(dayKey: string) {
  return formatInZone(parseDateParam(dayKey), "EEEE, MMMM d");
}

export function fromInputValue(value: string) {
  const parsed = parse(value, dateTimeInputFormat, new Date(), zone);
  return isValid(parsed) ? toIso(parsed) : null;
}
