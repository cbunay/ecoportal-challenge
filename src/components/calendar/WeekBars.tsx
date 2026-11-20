import { eventTimeLabel, layoutWeekEvents } from "@/lib/calendar-grid";
import type { CalendarEvent } from "@/sever/event.type";
import { selectEvent } from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch } from "@/store/hooks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const barHeight = 20;

export function WeekBars({
  week,
  events,
}: {
  week: { key: string }[];
  events: CalendarEvent[];
}) {
  const dispatch = useCalendarDispatch();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gridAutoRows: barHeight,
        rowGap: "2px",
      }}
    >
      {layoutWeekEvents(week, events).map(
        ({ event, colStart, colEnd, lane, startsInWeek, endsInWeek }) => {
          const singleDay = startsInWeek && endsInWeek && colStart === colEnd;

          return (
            <Typography
              key={event.id}
              noWrap
              title={event.name}
              role="button"
              tabIndex={0}
              onClick={() => dispatch(selectEvent(event))}
              sx={{
                gridColumn: `${colStart + 1} / ${colEnd + 2}`,
                gridRow: lane + 1,
                ml: startsInWeek ? "4px" : 0,
                mr: endsInWeek ? "4px" : 0,
                px: 0.75,
                fontSize: 11,
                lineHeight: `${barHeight}px`,
                color: "#fff",
                bgcolor: "#1A73E8",
                pointerEvents: "auto",
                cursor: "pointer",
                borderTopLeftRadius: startsInWeek ? "4px" : 0,
                borderBottomLeftRadius: startsInWeek ? "4px" : 0,
                borderTopRightRadius: endsInWeek ? "4px" : 0,
                borderBottomRightRadius: endsInWeek ? "4px" : 0,
              }}
            >
              {singleDay ? `${eventTimeLabel(event.startDate)} ` : ""}
              {event.name}
            </Typography>
          );
        },
      )}
    </Box>
  );
}
