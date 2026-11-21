"use client";

import {
  draftToEvent,
  CalendarView,
  monthRange,
  parseDateParam,
  weekRange,
} from "@/lib/calendar-grid";

import {
  clearDraftEvent,
  clearActiveEvent,
  selectDraftEvent,
  selectActiveEvent,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch, useCalendarSelector } from "@/store/hooks";
import { useGetEventsQuery } from "@/store/features/events/events.api";
import { useState } from "react";
import { CreateEventDialog } from "./CreateEventDialog";
import { EditEventDialog } from "./EditEventDialog";
import { MonthGrid } from "./MonthGrid";
import { ViewEventDialog } from "./ViewEventDialog";
import { WeekGrid } from "./WeekGrid";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useParams, useSearchParams } from "next/navigation";

export function CalendarBoard() {
  const dispatch = useCalendarDispatch();
  const [editing, setEditing] = useState(false);
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = parseDateParam(useSearchParams().get("date"));
  const activeEvent = useCalendarSelector(selectActiveEvent);
  const draftEvent = useCalendarSelector(selectDraftEvent);
  const previewEvent = draftEvent && draftToEvent(draftEvent);

  const range =
    view === CalendarView.Week
      ? weekRange(focusedDate)
      : monthRange(focusedDate);
      
  const {
    data: events = [],
    isFetching,
    isError,
    refetch,
  } = useGetEventsQuery(range);

  function closeActiveEvent() {
    setEditing(false);
    dispatch(clearActiveEvent());
  }

  const visibleEvents = previewEvent ? [...events, previewEvent] : events;

  const grid =
    view === CalendarView.Week ? (
      <WeekGrid events={visibleEvents} focusedDate={focusedDate} />
    ) : (
      <MonthGrid events={visibleEvents} focusedDate={focusedDate} />
    );

  return (
    <>
      {isFetching && (
        <LinearProgress
          aria-label="Loading events"
          sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}
        />
      )}
      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Could not load events
        </Alert>
      )}
      {grid}
      {draftEvent && (
        <CreateEventDialog
          draftEvent={draftEvent}
          onClose={() => dispatch(clearDraftEvent())}
        />
      )}
      {activeEvent &&
        (editing ? (
          <EditEventDialog event={activeEvent} onClose={closeActiveEvent} />
        ) : (
          <ViewEventDialog
            event={activeEvent}
            onEdit={() => setEditing(true)}
            onClose={closeActiveEvent}
          />
        ))}
    </>
  );
}
