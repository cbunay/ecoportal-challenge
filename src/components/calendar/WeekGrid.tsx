import {
  buildWeekDays,
  formatDateParam,
  eventTimeLabel,
  groupEventsByDay,
  isMultiDay,
  layoutDayEvents,
  timeZoneOffsetLabel,
  weekHourLabels,
} from "@/lib/calendar-grid";
import type { CalendarEvent } from "@/sever/event.type";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  setDraftEvent,
  type EventDraft,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";

import { WeekBars } from "./WeekBars";

const border = "1px solid #e6e8ec";
const columns = "72px repeat(7, minmax(0, 1fr))";
const hourHeight = 48;
const minEventHeight = 22;

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
  const openEvent = (id: string) =>
    router.push(
      `/calendar/${view}/${formatDateParam(focusedDate)}/event/${id}`,
    );
  const openCreate = (draft: EventDraft) => {
    dispatch(setDraftEvent(draft));
    router.push(`/calendar/${view}/${formatDateParam(focusedDate)}/event/new`);
  };
  const today = new Date();
  const days = buildWeekDays(focusedDate, today);
  const hours = weekHourLabels();
  const offsetLabel = timeZoneOffsetLabel(today);
  const eventsByDay = groupEventsByDay(events);
  const multiDayEvents = events.filter(isMultiDay);

  return (
    <Stack
      role="grid"
      aria-label="Week"
      direction="column"
      sx={{ minHeight: 0 }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: columns,
          bgcolor: "#fff",
          borderBottom: border,
        }}
      >
        <Typography
          sx={{
            alignSelf: "end",
            px: 1,
            pb: 1,
            fontSize: 10,
            color: "#70757a",
          }}
        >
          {offsetLabel}
        </Typography>
        {days.map((day) => (
          <Stack
            direction="column"
            key={day.key}
            sx={{
              py: 1,
              borderLeft: border,
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: 11, letterSpacing: 0.4, color: "#70757a" }}
            >
              {day.weekday}
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 20,
                borderRadius: "50%",
                width: 30,
                height: 30,
                backgroundColor: day.isToday ? "#1A73E8" : "transparent",
                color: day.isToday ? "#fff" : "#3c4043",
              }}
            >
              {day.label}
            </Typography>
          </Stack>
        ))}
      </Box>
      {multiDayEvents.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: columns,
            py: "2px",
            borderBottom: border,
          }}
        >
          <Box sx={{ gridColumn: "2 / -1" }}>
            <WeekBars week={days} events={multiDayEvents} />
          </Box>
        </Box>
      )}
      <Stack direction="column" sx={{ overflow: "auto" }}>
        <Box sx={{ position: "relative" }}>
          {hours.map((hour, hourIndex) => (
            <Box
              key={hour}
              role="row"
              sx={{
                display: "grid",
                gridTemplateColumns: columns,
                height: hourHeight,
                borderBottom: border,
              }}
            >
              <Typography
                sx={{
                  pr: 1,
                  pt: 0.5,
                  textAlign: "right",
                  fontSize: 10,
                  color: "#70757a",
                }}
              >
                {hour}
              </Typography>
              {days.map((day) => (
                <Box
                  key={`${day.key}-${hour}`}
                  role="gridcell"
                  onClick={() =>
                    openCreate({
                      date: day.key,
                      startTime: `${String(hourIndex).padStart(2, "0")}:00`,
                    })
                  }
                  sx={{ borderLeft: border, cursor: "pointer" }}
                />
              ))}
            </Box>
          ))}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: columns,
              pointerEvents: "none",
            }}
          >
            <Box />
            {days.map((day) => (
              <Box key={day.key} sx={{ position: "relative", minWidth: 0 }}>
                {layoutDayEvents(eventsByDay[day.key] ?? []).map(
                  ({ event, startMinutes, endMinutes, index, count }) => {
                    const step = 100 / (count + 1);

                    return (
                      <Box
                        key={event.id}
                        title={`${event.name}, ${eventTimeLabel(event.startDate)}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => openEvent(event.id)}
                        sx={{
                          ...(event.id === "draft" && {
                            anchorName: "--draft",
                          }),
                          position: "absolute",
                          top: (startMinutes / 60) * hourHeight,
                          height: Math.max(
                            ((endMinutes - startMinutes) / 60) * hourHeight,
                            minEventHeight,
                          ),
                          left: `${index * step}%`,
                          width: `${100 - (count - 1) * step}%`,
                          zIndex: index + 1,
                          px: 0.75,
                          overflow: "hidden",
                          pointerEvents: "auto",
                          cursor: "pointer",
                          fontSize: 11,
                          lineHeight: "18px",
                          borderRadius: "4px",
                          border: "1px solid #fff",
                          color: "#fff",
                          bgcolor: "#709cd7",
                        }}
                      >
                        <Typography noWrap sx={{ font: "inherit" }}>
                          {event.name}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{ font: "inherit", opacity: 0.85 }}
                        >
                          {eventTimeLabel(event.startDate)}
                        </Typography>
                      </Box>
                    );
                  },
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
