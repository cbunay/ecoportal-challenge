import type { WeekDay } from "@/lib/calendar-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const border = "1px solid #e6e8ec";

export function WeekGrid({
  days,
  hours,
  offsetLabel,
}: {
  days: WeekDay[];
  hours: string[];
  offsetLabel: string;
}) {

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
          gridTemplateColumns: "72px repeat(7, 1fr)",
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
      <Stack direction="column" sx={{ overflow: "auto" }}>
        {hours.map((hour) => (
          <Box
            key={hour}
            role="row"
            sx={{
              display: "grid",
              gridTemplateColumns: "72px repeat(7, 1fr)",
              minHeight: 48,
              borderBottom: border,
              overflow: "auto",
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
                sx={{ borderLeft: border }}
              />
            ))}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
