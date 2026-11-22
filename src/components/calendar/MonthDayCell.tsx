import type { MonthDay } from "@/lib/calendar-grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const labelColor = (day: MonthDay) => (day.inMonth ? "#3c4043" : "#70757a");

export function MonthDayCell({
  day,
  onClick,
}: {
  day: MonthDay;
  onClick: () => void;
}) {
  return (
    <Stack
      role="gridcell"
      aria-current={day.isToday ? "date" : undefined}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        minWidth: 0,
        p: "0 1rem 1rem 1rem",
        alignItems: "center",
        borderRight: "1px solid #e6e8ec",
        "&:last-of-type": { borderRight: "none" },
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 500,
          textAlign: "center",
          lineHeight: "24px",
          width: day.isToday ? 24 : "auto",
          borderRadius: "50%",
          color: day.isToday ? "#fff" : labelColor(day),
          bgcolor: day.isToday ? "#1A73E8" : "transparent",
        }}
      >
        {day.label}
      </Typography>
    </Stack>
  );
}
