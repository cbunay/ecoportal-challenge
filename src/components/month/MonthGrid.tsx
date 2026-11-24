import { paths } from "@/lib/calendar-paths";
import Stack from "@mui/material/Stack";
import { useParams, useRouter } from "next/navigation";

import { dateFormat, formatInZone } from "@/lib/calendar-dates";
import {
  buildMonthWeeks,
  draftSlot,
  lineUpMultiDayEvents,
} from "@/lib/calendar-layout";
import type { CalendarEvent } from "@/sever/event.type";
import {
  setDraftEvent,
  type EventDraft,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch } from "@/store/hooks";
import { EventBar } from "../event/EventBar";
import { MonthHeader } from "./MonthHeader";
import { DayCell, WeekRow } from "./Month.styles";

export function MonthGrid({
  focusedDate,
  events = [],
}: {
  focusedDate: Date;
  events?: CalendarEvent[];
}) {
  const dispatch = useCalendarDispatch();
  const router = useRouter();
  const { view } = useParams<{ view: string }>();
  const weeks = buildMonthWeeks(focusedDate, new Date());

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
    <Stack sx={{ flex: 1 }}>
      <MonthHeader days={weeks[0] ?? []} />
      {weeks.map((week) => {
        const { bars, lanes } = lineUpMultiDayEvents(week, events);

        return (
          <WeekRow key={week[0]?.key} lanes={lanes}>
            {week.map((day, column) => (
              <DayCell
                key={day.key}
                day={day}
                column={column + 1}
                onClick={() => openCreate({ date: day.key })}
              />
            ))}
            {bars.map((bar) => (
              <EventBar
                key={bar.event.id}
                {...bar}
                rowOffset={1}
                onOpen={openEvent}
              />
            ))}
          </WeekRow>
        );
      })}
    </Stack>
  );
}
