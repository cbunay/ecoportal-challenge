import { eventTimeLabel, type PositionedEvent } from "@/lib/calendar-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { HOUR_HEIGHT } from "../week/Week.styles";

export function EventBlock({
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
        top: (startMinutes / 60) * HOUR_HEIGHT,
        height: Math.max(((endMinutes - startMinutes) / 60) * HOUR_HEIGHT, 22),
        left: `${index * step}%`,
        width: `${100 - (count - 1) * step}%`,
        zIndex: index + 1,
        px: 0.75,
        overflow: "hidden",
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
