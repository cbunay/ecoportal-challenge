import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {
  buildMonthWeeks,
  draftToEvent,
  formatDateParam,
  lineUpMultiDayEvents,
} from "@/lib/calendar-grid";
import type { CalendarEvent } from "@/sever/event.type";
import {
  setDraftEvent,
  type EventDraft,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";
import {
  MonthContainer,
  MultiDayEvent,
  MultiDayEventRow,
} from "../event/MultiDayEvent";
import { MonthDayCell } from "./MonthDayCell";
import { MonthHeader } from "./MonthHeader";

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
      `/calendar/${view}/${formatDateParam(focusedDate)}/event/new?slot=${Date.parse(draftToEvent(draft)?.startDate ?? "")}`,
    );
  };

  const openEvent = (id: string) =>
    router.push(
      `/calendar/${view}/${formatDateParam(focusedDate)}/event/${id}`,
    );

  return (
    <Stack sx={{ flex: 1 }}>
      <MonthHeader days={weeks[0] ?? []} />
      {weeks.map((week) => (
        <Box
          key={week[0]?.key}
          role="row"
          sx={{
            flex: 1,
            minHeight: 0,
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            "&:not(:last-of-type)": { borderBottom: "1px solid #e6e8ec" },
          }}
        >
          {week.map((day) => (
            <MonthDayCell
              key={day.key}
              day={day}
              onClick={() => openCreate({ date: day.key })}
            />
          ))}

          <MonthContainer>
            <MultiDayEventRow>
              {lineUpMultiDayEvents(week, events).map((bar) => (
                <MultiDayEvent key={bar.event.id} {...bar} onOpen={openEvent} />
              ))}
            </MultiDayEventRow>
          </MonthContainer>
        </Box>
      ))}
    </Stack>
  );
}
