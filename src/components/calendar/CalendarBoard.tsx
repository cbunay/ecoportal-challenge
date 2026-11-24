"use client";

import {
  CalendarView,
  monthRange,
  toIso,
  weekRange,
} from "@/lib/calendar-dates";
import { draftToEvent } from "@/lib/calendar-layout";

import { useFocusedDate } from "@/lib/use-focused-date";
import { selectDraftEvent } from "@/store/features/calendar/calendar.slice";
import { useGetEventsQuery } from "@/store/features/events/events.api";
import { useCalendarSelector } from "@/store/hooks";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useParams } from "next/navigation";
import { MonthGrid } from "../month/MonthGrid";
import { WeekGrid } from "../week/WeekGrid";

export function CalendarBoard() {
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = useFocusedDate();
  const draftEvent = useCalendarSelector(selectDraftEvent);
  const previewEvent = draftEvent && draftToEvent(draftEvent);

  const { start, end } =
    view === CalendarView.Week
      ? weekRange(focusedDate)
      : monthRange(focusedDate);

  const {
    data: events = [],
    isFetching,
    isError,
    refetch,
  } = useGetEventsQuery({ start: toIso(start), end: toIso(end) });

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
