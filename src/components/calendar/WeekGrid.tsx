import {
  buildGmtOffsetLabel,
  buildHourLabels,
  buildWeekDays,
  draftToEvent,
  formatDateParam,
  groupEventsByDay,
  isMultiDay,
  lineUpDayEvents,
  lineUpMultiDayEvents,
} from "@/lib/calendar-grid";
import type { CalendarEvent } from "@/sever/event.type";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {
  setDraftEvent,
  type EventDraft,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { DayColumn, DayEvent, WeekContainer } from "../event/DayEvent";
import { MultiDayEvent, MultiDayEventRow } from "../event/MultiDayEvent";
import { WeekHeader } from "./WeekHeader";
import { HourCell, HourRow } from "./WeekHour";

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
  const offsetLabel = buildGmtOffsetLabel(focusedDate);
  const eventsByDay = groupEventsByDay(events);
  const multiDayEvents = events.filter(isMultiDay);

  const openCreate = (draft: EventDraft) => {
    dispatch(setDraftEvent(draft));
    router.push(
      `/calendar/${view}/${formatDateParam(focusedDate)}/event/new?slot=${Date.parse(draftToEvent(draft)?.startDate ?? "")}`,
    );
  };

  const openEvent = (id: string) =>
    router.push(
      `/calendar/${view}/${formatDateParam(focusedDate)}/event/${id}`,
    );

  return (
    <Stack role="grid" aria-label="Week" sx={{ minHeight: 0 }}>
      <WeekHeader days={weekDays} offsetLabel={offsetLabel} />

      <MultiDayEventRow inWeekView>
        {lineUpMultiDayEvents(weekDays, multiDayEvents).map((bar) => (
          <MultiDayEvent key={bar.event.id} {...bar} onOpen={openEvent} />
        ))}
      </MultiDayEventRow>

      <Stack sx={{ overflow: "auto", position: "relative" }}>
        <Stack>
          {hours.map((hour, hourIndex) => (
            <HourRow key={hour} hour={hour}>
              {weekDays.map((day) => (
                <HourCell
                  key={`${day.key}-${hour}`}
                  onClick={() =>
                    openCreate({
                      date: day.key,
                      startTime: `${String(hourIndex).padStart(2, "0")}:00`,
                    })
                  }
                />
              ))}
            </HourRow>
          ))}
        </Stack>

        <WeekContainer>
          <Box />
          {weekDays.map((day) => (
            <DayColumn key={day.key}>
              {lineUpDayEvents(eventsByDay[day.key] ?? []).map((event) => (
                <DayEvent
                  key={event.event.id}
                  {...event}
                  onClick={() => openEvent(event.event.id)}
                />
              ))}
            </DayColumn>
          ))}
        </WeekContainer>
      </Stack>
    </Stack>
  );
}
