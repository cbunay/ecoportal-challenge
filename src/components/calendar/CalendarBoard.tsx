"use client";

import {
  buildMonthWeeks,
  buildWeekDays,
  CalendarView,
  eventDayKey,
  isMultiDay,
  monthRange,
  parseDateParam,
  timeZoneOffsetLabel,
  weekHourLabels,
  weekRange,
} from "@/lib/calendar-grid";

import { useGetEventsQuery } from "@/store/features/events/events.api";
import type { CalendarEvent } from "@/sever/event.type";

import { MonthGrid } from "./MonthGrid";
import { WeekGrid } from "./WeekGrid";
import { useParams, useSearchParams } from "next/navigation";

export function CalendarBoard() {
  const today = new Date();
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = parseDateParam(useSearchParams().get("date"), today);

  const range =
    view === CalendarView.Week
      ? weekRange(focusedDate)
      : monthRange(focusedDate);
  const { data: events = [] } = useGetEventsQuery(range);

  const eventsByDay: Record<string, CalendarEvent[]> = {};
  for (const event of events.filter((event) => !isMultiDay(event))) {
    (eventsByDay[eventDayKey(event.startDate)] ??= []).push(event);
  }

  if (view === CalendarView.Week) {
    return (
      <WeekGrid
        eventsByDay={eventsByDay}
        multiDayEvents={events.filter(isMultiDay)}
        days={buildWeekDays(focusedDate, today)}
        hours={weekHourLabels()}
        offsetLabel={timeZoneOffsetLabel(today)}
      />
    );
  }

  return (
    <MonthGrid events={events} weeks={buildMonthWeeks(focusedDate, today)} />
  );
}
