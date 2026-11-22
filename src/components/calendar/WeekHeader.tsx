import type { WeekDay } from "@/lib/calendar-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const border = "1px solid #e6e8ec";
const columns = "72px repeat(7, minmax(0, 1fr))";

export function WeekHeader({
  days,
  offsetLabel,
}: {
  days: WeekDay[];
  offsetLabel: string;
}) {
  return (
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
  );
}
