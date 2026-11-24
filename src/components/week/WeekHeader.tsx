import { WeekDay } from "@/lib/calendar-layout";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { WEEK_COLUMNS } from "./Week.styles";

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
        gridTemplateColumns: WEEK_COLUMNS,
        bgcolor: "#fff",
        borderBottom: "1px solid #e6e8ec",
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
        <WeekHeaderDay key={day.key} day={day} />
      ))}
    </Box>
  );
}

function WeekHeaderDay({ day }: { day: WeekDay }) {
  return (
    <Stack
      sx={{
        py: 1,
        borderLeft: "1px solid #e6e8ec",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontSize: 11, letterSpacing: 0.4, color: "#70757a" }}>
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
  );
}
