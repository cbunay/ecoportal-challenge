import { formatInZone } from "@/lib/calendar-dates";
import { type WeekBar } from "@/lib/calendar-layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Children, type ReactNode } from "react";
import { GUTTER_WIDTH } from "../week/Week.styles";

export const BAR_HEIGHT = 20;

export function EventBar({
  event,
  colStart,
  colEnd,
  lane,
  startsInWeek,
  endsInWeek,
  rowOffset = 0,
  onOpen,
}: WeekBar & { rowOffset?: number; onOpen: (id: string) => void }) {
  const singleDay = startsInWeek && endsInWeek && colStart === colEnd;
  const timeLabel = formatInZone(new Date(event.startDate), "h:mm a");

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
        gridRow: lane + 1 + rowOffset,
        ml: startsInWeek ? "4px" : 0,
        mr: endsInWeek ? "4px" : 0,
        px: 0.75,
        fontSize: 11,
        lineHeight: `${BAR_HEIGHT}px`,
        color: "#fff",
        bgcolor: "#709cd7",
        cursor: "pointer",
        borderTopLeftRadius: startsInWeek ? "4px" : 0,
        borderBottomLeftRadius: startsInWeek ? "4px" : 0,
        borderTopRightRadius: endsInWeek ? "4px" : 0,
        borderBottomRightRadius: endsInWeek ? "4px" : 0,
      }}
    >
      {singleDay ? `${timeLabel} ` : ""}
      {event.name}
    </Typography>
  );
}

export function EventBarRow({
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
        gridAutoRows: BAR_HEIGHT,
        rowGap: "2px",
        py: "2px",
        ...(inWeekView && {
          pl: `${GUTTER_WIDTH}px`,
          borderBottom: "1px solid #e6e8ec",
        }),
      }}
    >
      {children}
    </Box>
  );
}
