"use client";

import {
  buildMonthWeeks,
  buildWeekDays,
  draftEventToEvent,
  CalendarView,
  eventDayKey,
  isMultiDay,
  monthRange,
  parseDateParam,
  timeZoneOffsetLabel,
  weekHourLabels,
  weekRange,
} from "@/lib/calendar-grid";

import {
  clearDraftEvent,
  clearSelectedEvent,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch, useCalendarSelector } from "@/store/hooks";
import { useGetEventsQuery } from "@/store/features/events/events.api";
import type { CalendarEvent } from "@/sever/event.type";

import { CreateEventDialog } from "./CreateEventDialog";
import { MonthGrid } from "./MonthGrid";
import { ViewEventDialog } from "./ViewEventDialog";
import { WeekGrid } from "./WeekGrid";
import LinearProgress from "@mui/material/LinearProgress";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export function CalendarBoard() {
  const today = new Date();
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = parseDateParam(useSearchParams().get("date"), today);
  const dispatch = useCalendarDispatch();
  const selected = useCalendarSelector((state) => state.calendar.selectedEvent);
  const draftEvent = useCalendarSelector((state) => state.calendar.draftEvent);

  const preview = draftEvent && draftEventToEvent(draftEvent);

  const range =
    view === CalendarView.Week
      ? weekRange(focusedDate)
      : monthRange(focusedDate);
  const { data: events = [], isFetching, isError } = useGetEventsQuery(range);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Could not load events", { variant: "error" });
    }
  }, [isError, enqueueSnackbar]);

  const shown = preview ? [...events, preview] : events;
  const eventsByDay: Record<string, CalendarEvent[]> = {};
  for (const event of shown.filter((event) => !isMultiDay(event))) {
    (eventsByDay[eventDayKey(event.startDate)] ??= []).push(event);
  }

  const grid =
    view === CalendarView.Week ? (
      <WeekGrid
        eventsByDay={eventsByDay}
        multiDayEvents={shown.filter(isMultiDay)}
        days={buildWeekDays(focusedDate, today)}
        hours={weekHourLabels()}
        offsetLabel={timeZoneOffsetLabel(today)}
      />
    ) : (
      <MonthGrid events={shown} weeks={buildMonthWeeks(focusedDate, today)} />
    );

  return (
    <>
      {isFetching && (
        <LinearProgress
          aria-label="Loading events"
          sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}
        />
      )}
      {grid}
      {draftEvent && (
        <CreateEventDialog
          draftEvent={draftEvent}
          onClose={() => dispatch(clearDraftEvent())}
        />
      )}
      {selected && (
        <ViewEventDialog
          event={selected}
          onClose={() => dispatch(clearSelectedEvent())}
        />
      )}
    </>
  );
}
