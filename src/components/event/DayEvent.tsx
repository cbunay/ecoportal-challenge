import { eventTimeLabel, type PositionedEvent } from "@/lib/calendar-grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

const minEventHeight = 22;
const hourHeight = 48;

export function DayEvent({
  event,
  startMinutes,
  endMinutes,
  index,
  count,
  onClick,
}: PositionedEvent & {
  onClick: () => void;
}) {
  const step = 100 / (count + 1);
  const time = eventTimeLabel(event.startDate);

  return (
    <Box
      title={`${event.name}, ${time}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
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
      <Typography noWrap sx={{ font: "inherit", opacity: 0.85 }}>
        {time}
      </Typography>
    </Box>
  );
}

export function DayColumn({ children }: { children: ReactNode }) {
  return <Box sx={{ position: "relative", minWidth: 0 }}>{children}</Box>;
}

export const WeekContainer = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "grid",
  gridTemplateColumns: "72px repeat(7, minmax(0, 1fr))",
  pointerEvents: "none",
});
