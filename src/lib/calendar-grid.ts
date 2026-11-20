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
import type { CalendarEvent } from "@/sever/event.type";

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

function utcIso(date: Date) {
  return new Date(date.getTime()).toISOString();
}

export function monthRange(reference: Date) {
  const monthStart = startOfMonth(reference, { in: inTimeZone });

  return {
    start: utcIso(startOfWeek(monthStart, weekOptions)),
    end: utcIso(
      endOfWeek(endOfMonth(reference, { in: inTimeZone }), weekOptions),
    ),
  };
}

export function weekRange(reference: Date) {
  return {
    start: utcIso(startOfWeek(reference, weekOptions)),
    end: utcIso(endOfWeek(reference, weekOptions)),
  };
}

export function eventDayKey(iso: string) {
  return dayKey(new Date(iso));
}

export function eventTimeLabel(iso: string) {
  return format(new Date(iso), "h:mm a", { in: inTimeZone });
}

export function eventHourLabel(iso: string) {
  return format(new Date(iso), "h a", { in: inTimeZone });
}

export type PositionedEvent = {
  event: CalendarEvent;
  startMinutes: number;
  endMinutes: number;
  // Position inside a group of overlapping events, and the group's size.
  index: number;
  count: number;
};

function minutesOfDay(iso: string) {
  const date = new Date(iso);
  return (
    Number(format(date, "H", { in: inTimeZone })) * 60 +
    Number(format(date, "m", { in: inTimeZone }))
  );
}

/** Places one day's events on the 24h axis and groups the overlapping ones. */
export function layoutDayEvents(events: CalendarEvent[]): PositionedEvent[] {
  const items = events
    .map((event) => {
      const startMinutes = minutesOfDay(event.startDate);
      const duration =
        (new Date(event.endDate).getTime() -
          new Date(event.startDate).getTime()) /
        60000;

      return {
        event,
        startMinutes,
        endMinutes: Math.min(startMinutes + duration, 24 * 60),
      };
    })
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const result: PositionedEvent[] = [];
  let group: typeof items = [];
  let groupEnd = 0;

  const flush = () => {
    group.forEach((item, index) =>
      result.push({ ...item, index, count: group.length }),
    );
    group = [];
  };

  for (const item of items) {
    if (group.length && item.startMinutes >= groupEnd) flush();
    groupEnd = group.length
      ? Math.max(groupEnd, item.endMinutes)
      : item.endMinutes;
    group.push(item);
  }
  flush();

  return result;
}

export type WeekBar = {
  event: CalendarEvent;
  // Zero-based day columns the bar covers inside this week.
  colStart: number;
  colEnd: number;
  lane: number;
  // False when the event continues from / into the adjacent week.
  startsInWeek: boolean;
  endsInWeek: boolean;
};

/** First and last day (yyyy-MM-dd) an event occupies. */
function eventDayRange(event: CalendarEvent) {
  const startKey = eventDayKey(event.startDate);
  // An event ending exactly at midnight does not occupy that day.
  const endKey = eventDayKey(
    new Date(new Date(event.endDate).getTime() - 1).toISOString(),
  );

  return { startKey, endKey: endKey < startKey ? startKey : endKey };
}

export function isMultiDay(event: CalendarEvent) {
  const { startKey, endKey } = eventDayRange(event);

  return startKey !== endKey;
}

/** Lays out the events touching one week as bars in stacked lanes. */
export function layoutWeekEvents(
  week: { key: string }[],
  events: CalendarEvent[],
): WeekBar[] {
  const weekStart = week[0].key;
  const weekEnd = week[week.length - 1].key;

  const bars = events
    .map((event) => ({ event, ...eventDayRange(event) }))
    .filter(
      ({ startKey, endKey }) => startKey <= weekEnd && endKey >= weekStart,
    )
    .map(({ event, startKey, endKey }) => ({
      event,
      colStart:
        startKey <= weekStart ? 0 : week.findIndex((d) => d.key === startKey),
      colEnd:
        endKey >= weekEnd
          ? week.length - 1
          : week.findIndex((d) => d.key === endKey),
      startsInWeek: startKey >= weekStart,
      endsInWeek: endKey <= weekEnd,
    }))
    // Longest first so wide bars take the top lanes.
    .sort(
      (a, b) =>
        a.colStart - b.colStart ||
        b.colEnd - a.colEnd ||
        a.event.startDate.localeCompare(b.event.startDate),
    );

  const laneEnds: number[] = [];

  return bars.map((bar) => {
    let lane = laneEnds.findIndex((end) => end < bar.colStart);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = bar.colEnd;

    return { ...bar, lane };
  });
}
