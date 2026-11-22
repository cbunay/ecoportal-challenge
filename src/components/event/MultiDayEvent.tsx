import { eventTimeLabel, type WeekBar } from "@/lib/calendar-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Children, type ReactNode } from "react";

const barHeight = 20;

export function MultiDayEvent({
  event,
  colStart,
  colEnd,
  lane,
  startsInWeek,
  endsInWeek,
  onOpen,
}: WeekBar & { onOpen: (id: string) => void }) {
  const singleDay = startsInWeek && endsInWeek && colStart === colEnd;

  return (
    <Typography
      noWrap
      title={event.name}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(event.id)}
      sx={{
        ...(event.id === "draft" && { anchorName: "--draft" }),
        gridColumn: `${colStart + 1} / ${colEnd + 2}`,
        gridRow: lane + 1,
        ml: startsInWeek ? "4px" : 0,
        mr: endsInWeek ? "4px" : 0,
        px: 0.75,
        fontSize: 11,
        lineHeight: `${barHeight}px`,
        color: "#fff",
        bgcolor: "#709cd7",
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
}

const weekGutter = 72;

// `inWeekView` aligns the bars with the day columns (past the time gutter)
// and adds the divider under the all-day strip; the month grid needs neither.
export function MultiDayEventRow({
  children,
  inWeekView = false,
}: {
  children: ReactNode;
  inWeekView?: boolean;
}) {
  if (Children.count(children) === 0) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gridAutoRows: barHeight,
        rowGap: "2px",
        py: "2px",
        ...(inWeekView && {
          pl: `${weekGutter}px`,
          borderBottom: "1px solid #e6e8ec",
        }),
      }}
    >
      {children}
    </Box>
  );
}

const barsTop = 28;

export function MonthContainer({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: barsTop,
        left: 0,
        right: 0,
        pointerEvents: "none",
      }}
    >
      {children}
    </Box>
  );
}
