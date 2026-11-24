import { paths } from "@/lib/calendar-paths";
import {
  getGmtOffsetLabel,
  dateFormat,
  formatInZone,
  formatDayLabel,
} from "@/lib/calendar-dates";
import {
  buildHourLabels,
  buildWeekDays,
  draftSlot,
  groupEventsByDay,
  isMultiDay,
  lineUpDayEvents,
  lineUpMultiDayEvents,
} from "@/lib/calendar-layout";
import type { CalendarEvent } from "@/sever/event.type";
import Stack from "@mui/material/Stack";

import {
  setDraftEvent,
  type EventDraft,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { EventBlock } from "../event/EventBlock";
import { EventBar, EventBarRow } from "../event/EventBar";
import { DayColumn, HourCell, HourColumn, WeekBody } from "./Week.styles";
import { WeekHeader } from "./WeekHeader";

export function WeekGrid({
  focusedDate,
  events = [],
}: {
  focusedDate: Date;
  events?: CalendarEvent[];
}) {
  const dispatch = useCalendarDispatch();
  const router = useRouter();
  const { view } = useParams<{ view: string }>();
  const weekDays = buildWeekDays(focusedDate);
  const hours = buildHourLabels();
  const offsetLabel = getGmtOffsetLabel(focusedDate);
  const eventsByDay = groupEventsByDay(events);
  const multiDayEvents = events.filter(isMultiDay);

  const openCreate = (draft: EventDraft) => {
    dispatch(setDraftEvent(draft));
    router.push(
      paths.eventCreate(
        view,
        formatInZone(focusedDate, dateFormat),
        draftSlot(draft),
      ),
    );
  };

  const openEvent = (id: string) =>
    router.push(
      paths.eventDetails(view, formatInZone(focusedDate, dateFormat), id),
    );

  return (
    <Stack role="grid" aria-label="Week" sx={{ minHeight: 0 }}>
      <WeekHeader days={weekDays} offsetLabel={offsetLabel} />

      <EventBarRow inWeekView>
        {lineUpMultiDayEvents(weekDays, multiDayEvents).bars.map((bar) => (
          <EventBar key={bar.event.id} {...bar} onOpen={openEvent} />
        ))}
      </EventBarRow>

      <WeekBody>
        <HourColumn hours={hours} />
        {weekDays.map((day) => {
          return (
            <DayColumn key={day.key} role="rowgroup">
              {hours.map((hour, hourIndex) => (
                <HourCell
                  key={hour}
                  role="gridcell"
                  aria-label={`${formatDayLabel(day.key)}, ${hour}`}
                  onClick={() =>
                    openCreate({
                      date: day.key,
                      startTime: `${String(hourIndex).padStart(2, "0")}:00`,
                    })
                  }
                />
              ))}
              {lineUpDayEvents(eventsByDay[day.key] ?? []).map((event) => (
                <EventBlock
                  key={event.event.id}
                  {...event}
                  onClick={() => openEvent(event.event.id)}
                />
              ))}
            </DayColumn>
          );
        })}
      </WeekBody>
    </Stack>
  );
}
