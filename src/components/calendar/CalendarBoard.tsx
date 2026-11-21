"use client";

import {
  draftToEvent,
  CalendarView,
  monthRange,
  weekRange,
} from "@/lib/calendar-grid";

import { selectDraftEvent } from "@/store/features/calendar/calendar.slice";
import { useCalendarSelector } from "@/store/hooks";
import { useGetEventsQuery } from "@/store/features/events/events.api";
import { MonthGrid } from "./MonthGrid";
import { WeekGrid } from "./WeekGrid";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useParams } from "next/navigation";
import { useFocusedDate } from "@/lib/use-focused-date";

export function CalendarBoard() {
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = useFocusedDate();
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
    </>
  );
}
