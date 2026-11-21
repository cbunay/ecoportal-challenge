import { tz } from "@date-fns/tz";
import {
  addHours,
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
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { calendarTimeZone } from "@/lib/defaults";
import { EventType, type CalendarEvent } from "@/sever/event.type";

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

export function parseDateParam(param: string | null) {
  const today = startOfDay(new Date(), { in: inTimeZone });
  const parsed = param
    ? parse(param, "yyyy-MM-dd", today, { in: inTimeZone })
    : today;

  return isValid(parsed) ? parsed : today;
}

const inputFormat = "yyyy-MM-dd'T'HH:mm";

export function toInputValue(date: Date) {
  return format(date, inputFormat, { in: inTimeZone });
}

export function fromInputValue(value: string) {
  const parsed = parse(value, inputFormat, new Date(), { in: inTimeZone });

  return isValid(parsed) ? utcIso(parsed) : null;
}

function utcIso(date: Date) {
  return new Date(date.getTime()).toISOString();
}

export function monthRange(reference: Date) {
  const monthStart = startOfMonth(reference, { in: inTimeZone });
  const mothEnd = endOfMonth(reference, { in: inTimeZone });

  return {
    start: utcIso(startOfWeek(monthStart, weekOptions)),
    end: utcIso(endOfWeek(mothEnd, weekOptions)),
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

export function draftToEvent(draftEvent: {
  date: string;
  startTime?: string;
  endTime?: string;
  name?: string;
}) {
  const time =
    draftEvent.startTime ??
    format(addHours(startOfHour(new Date()), 1), "HH:mm", { in: inTimeZone });
  const startDate = fromInputValue(`${draftEvent.date}T${time}`);
  if (!startDate) return null;
  const typedEnd =
    draftEvent.endTime &&
    draftEvent.startTime &&
    draftEvent.endTime > draftEvent.startTime
      ? fromInputValue(`${draftEvent.date}T${draftEvent.endTime}`)
      : null;
  const endDate =
    typedEnd ??
    new Date(new Date(startDate).getTime() + 3_600_000).toISOString();

  return {
    id: "draft",
    name: draftEvent.name?.trim() || "(No title)",
    type: EventType.Meeting,
    startDate,
    endDate,
  };
}

export function eventTimeLabel(iso: string) {
  return format(new Date(iso), "h:mm a", { in: inTimeZone });
}

export function eventRangeLabel(event: CalendarEvent) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  if (isMultiDay(event)) {
    const pattern = "EEE, MMM d, h:mm a";
    return `${format(start, pattern, { in: inTimeZone })} – ${format(end, pattern, { in: inTimeZone })}`;
  }
  const day = format(start, "EEEE, MMMM d", { in: inTimeZone });
  return `${day} · ${eventTimeLabel(event.startDate)} – ${eventTimeLabel(event.endDate)}`;
}

export function eventHourLabel(iso: string) {
  return format(new Date(iso), "h a", { in: inTimeZone });
}

export type PositionedEvent = {
  event: CalendarEvent;
  startMinutes: number;
  endMinutes: number;
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
  colStart: number;
  colEnd: number;
  lane: number;
  startsInWeek: boolean;
  endsInWeek: boolean;
};

function eventDayRange(event: CalendarEvent) {
  const startKey = eventDayKey(event.startDate);
  const endKey = eventDayKey(
    new Date(new Date(event.endDate).getTime() - 1).toISOString(),
  );

  return { startKey, endKey: endKey < startKey ? startKey : endKey };
}

export function isMultiDay(event: CalendarEvent) {
  const { startKey, endKey } = eventDayRange(event);

  return startKey !== endKey;
}

export function groupEventsByDay(events: CalendarEvent[]) {
  const byDay: Record<string, CalendarEvent[]> = {};

  for (const event of events) {
    if (isMultiDay(event)) continue;

    const day = eventDayKey(event.startDate);
    byDay[day] ??= [];
    byDay[day].push(event);
  }

  return byDay;
}

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
