import {
  addHours,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  startOfHour,
} from "date-fns";

import {
  dateFormat,
  formatInZone,
  fromInputValue,
  monthRange,
  weekRange,
  zone,
} from "@/lib/calendar-dates";
import { EventType, type CalendarEvent } from "@/sever/event.type";

const daysPerWeek = 7;
const minutesPerDay = 24 * 60;
const msPerMinute = 60_000;
const msPerHour = 60 * msPerMinute;

function dayLabel(date: Date) {
  const dayOfMonth = formatInZone(date, "d");
  return dayOfMonth === "1" ? formatInZone(date, "MMM d") : dayOfMonth;
}

function eachZonedDay(start: Date, end: Date) {
  return eachDayOfInterval({ start, end }, zone);
}

export type MonthDay = {
  key: string;
  weekday: string;
  label: string;
  inMonth: boolean;
  isToday: boolean;
};

export function buildMonthWeeks(reference: Date, today: Date = reference) {
  const { monthStart, start, end } = monthRange(reference);
  const days = eachZonedDay(start, end);
  const weeks: MonthDay[][] = [];

  for (let index = 0; index < days.length; index += daysPerWeek) {
    const week = days.slice(index, index + daysPerWeek).map((day) => ({
      key: formatInZone(day, dateFormat),
      weekday: formatInZone(day, "EEE").toUpperCase(),
      label: dayLabel(day),
      inMonth: isSameMonth(day, monthStart, zone),
      isToday: isSameDay(day, today, zone),
    }));

    weeks.push(week);
  }

  return weeks;
}

export type WeekDay = {
  key: string;
  weekday: string;
  label: string;
  isToday: boolean;
};

export function buildWeekDays(reference: Date) {
  const { start, end } = weekRange(reference);
  const today = new Date();

  return eachZonedDay(start, end).map((day) => ({
    key: formatInZone(day, dateFormat),
    weekday: formatInZone(day, "EEE").toUpperCase(),
    label: formatInZone(day, "d"),
    isToday: isSameDay(day, today, zone),
  }));
}

export function buildHourLabels() {
  return Array.from({ length: 24 }, (_, hour) => {
    const clockHour = new Date(2026, 0, 1, hour);
    return format(clockHour, "h a");
  });
}

function defaultDraftStartTime() {
  const nextHour = addHours(startOfHour(new Date()), 1);
  return formatInZone(nextHour, "HH:mm");
}

function oneHourAfter(iso: string) {
  return new Date(new Date(iso).getTime() + msPerHour).toISOString();
}

export function draftToEvent(draft: {
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  name?: string;
}) {
  const startTime = draft.startTime ?? defaultDraftStartTime();
  const startDate = fromInputValue(`${draft.date}T${startTime}`);
  if (!startDate) return null;

  const typedEnd =
    draft.startTime && draft.endTime
      ? fromInputValue(`${draft.endDate || draft.date}T${draft.endTime}`)
      : null;

  return {
    id: "draft",
    name: draft.name?.trim() || "(No title)",
    type: EventType.Meeting,
    startDate,
    endDate:
      typedEnd && typedEnd > startDate ? typedEnd : oneHourAfter(startDate),
  };
}

export function draftSlot(draft: Parameters<typeof draftToEvent>[0]) {
  const startDate = draftToEvent(draft)?.startDate;
  return startDate ? Date.parse(startDate) : Date.now();
}

export function eventRangeLabel(event: CalendarEvent) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (isMultiDay(event)) {
    const when = "EEE, MMM d, h:mm a";
    const startLabel = formatInZone(start, when);
    const endLabel = formatInZone(end, when);
    return `${startLabel} – ${endLabel}`;
  }

  const day = formatInZone(start, "EEEE, MMMM d");
  const startLabel = formatInZone(start, "h:mm a");
  const endLabel = formatInZone(end, "h:mm a");

  return `${day} · ${startLabel} – ${endLabel}`;
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
  const hours = Number(formatInZone(date, "H"));
  const minutes = Number(formatInZone(date, "m"));
  return hours * 60 + minutes;
}

type TimedEvent = {
  event: CalendarEvent;
  startMinutes: number;
  endMinutes: number;
};

function toTimedEvent(event: CalendarEvent): TimedEvent {
  const startMinutes = minutesOfDay(event.startDate);
  const durationMinutes =
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
    msPerMinute;

  return {
    event,
    startMinutes,
    endMinutes: Math.min(startMinutes + durationMinutes, minutesPerDay),
  };
}

function overlappingClusters(items: TimedEvent[]) {
  const clusters: TimedEvent[][] = [];
  let current: TimedEvent[] = [];
  let clusterEnd = 0;

  for (const item of items) {
    const overlapsCurrent =
      current.length > 0 && item.startMinutes < clusterEnd;

    if (current.length > 0 && !overlapsCurrent) {
      clusters.push(current);
      current = [];
    }

    clusterEnd =
      current.length > 0
        ? Math.max(clusterEnd, item.endMinutes)
        : item.endMinutes;
    current.push(item);
  }

  if (current.length > 0) clusters.push(current);

  return clusters;
}

export function lineUpDayEvents(events: CalendarEvent[]): PositionedEvent[] {
  const timed = events
    .map(toTimedEvent)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  return overlappingClusters(timed).flatMap((cluster) =>
    cluster.map((item, index) => ({
      ...item,
      index,
      count: cluster.length,
    })),
  );
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
  const startKey = formatInZone(new Date(event.startDate), dateFormat);
  const inclusiveEnd = new Date(new Date(event.endDate).getTime() - 1);
  const endKey = formatInZone(inclusiveEnd, dateFormat);
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

    const day = formatInZone(new Date(event.startDate), dateFormat);
    byDay[day] ??= [];
    byDay[day].push(event);
  }

  return byDay;
}

type PlacedBar = Omit<WeekBar, "lane">;

function barsInWeek(
  week: { key: string }[],
  events: CalendarEvent[],
): PlacedBar[] {
  const weekStart = week[0].key;
  const weekEnd = week[week.length - 1].key;
  const lastColumn = week.length - 1;

  return events
    .map((event) => ({ event, ...eventDayRange(event) }))
    .filter(
      ({ startKey, endKey }) => startKey <= weekEnd && endKey >= weekStart,
    )
    .map(({ event, startKey, endKey }) => ({
      event,
      colStart:
        startKey <= weekStart
          ? 0
          : week.findIndex((day) => day.key === startKey),
      colEnd:
        endKey >= weekEnd
          ? lastColumn
          : week.findIndex((day) => day.key === endKey),
      startsInWeek: startKey >= weekStart,
      endsInWeek: endKey <= weekEnd,
    }))
    .sort(
      (a, b) =>
        a.colStart - b.colStart ||
        b.colEnd - a.colEnd ||
        a.event.startDate.localeCompare(b.event.startDate),
    );
}

function assignLanes(bars: PlacedBar[]): { bars: WeekBar[]; lanes: number } {
  const laneEnds: number[] = [];

  const placed = bars.map((bar) => {
    const openLane = laneEnds.findIndex(
      (endColumn) => endColumn < bar.colStart,
    );
    const lane = openLane === -1 ? laneEnds.length : openLane;
    laneEnds[lane] = bar.colEnd;
    return { ...bar, lane };
  });

  return { bars: placed, lanes: laneEnds.length };
}

export function lineUpMultiDayEvents(
  week: { key: string }[],
  events: CalendarEvent[],
): { bars: WeekBar[]; lanes: number } {
  return assignLanes(barsInWeek(week, events));
}
