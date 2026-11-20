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

import { clearSelectedEvent } from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch, useCalendarSelector } from "@/store/hooks";
import { useGetEventsQuery } from "@/store/features/events/events.api";
import type { CalendarEvent } from "@/sever/event.type";

import { MonthGrid } from "./MonthGrid";
import { ViewEventDialog } from "./ViewEventDialog";
import { WeekGrid } from "./WeekGrid";
import { useParams, useSearchParams } from "next/navigation";

export function CalendarBoard() {
  const today = new Date();
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = parseDateParam(useSearchParams().get("date"), today);

  const dispatch = useCalendarDispatch();
  const selected = useCalendarSelector((state) => state.calendar.selectedEvent);

  const range =
    view === CalendarView.Week
      ? weekRange(focusedDate)
      : monthRange(focusedDate);
  const { data: events = [] } = useGetEventsQuery(range);

  const eventsByDay: Record<string, CalendarEvent[]> = {};
  for (const event of events.filter((event) => !isMultiDay(event))) {
    (eventsByDay[eventDayKey(event.startDate)] ??= []).push(event);
  }

  const grid =
    view === CalendarView.Week ? (
      <WeekGrid
        eventsByDay={eventsByDay}
        multiDayEvents={events.filter(isMultiDay)}
        days={buildWeekDays(focusedDate, today)}
        hours={weekHourLabels()}
        offsetLabel={timeZoneOffsetLabel(today)}
      />
    ) : (
      <MonthGrid events={events} weeks={buildMonthWeeks(focusedDate, today)} />
    );

  return (
    <>
      {grid}
      {selected && (
        <ViewEventDialog
          event={selected}
          onClose={() => dispatch(clearSelectedEvent())}
        />
      )}
    </>
  );
}
