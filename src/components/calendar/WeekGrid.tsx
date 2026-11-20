import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { WeekDay } from "@/lib/calendar-grid";

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
    <Box
      role="grid"
      aria-label="Week"
      sx={{ flex: 1, minHeight: 0, overflow: "auto" }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "72px repeat(7, 1fr)",
          position: "sticky",
          top: 0,
          zIndex: 1,
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
          <Box
            key={day.key}
            role="columnheader"
            sx={{
              py: 1,
              textAlign: "center",
              borderLeft: border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{ fontSize: 11, letterSpacing: 0.4, color: "#70757a" }}
            >
              {day.weekday}
            </Typography>
            <Typography
              sx={{
                fontSize: 22,
                borderRadius: "50%",
                width: 32,
                height: 32,
                backgroundColor: day.isToday ? "#1A73E8" : "transparent",
                color: day.isToday ? "#fff" : "#3c4043",
              }}
            >
              {day.label}
            </Typography>
          </Box>
        ))}
      </Box>
      {hours.map((hour) => (
        <Box
          key={hour}
          role="row"
          sx={{
            display: "grid",
            gridTemplateColumns: "72px repeat(7, 1fr)",
            minHeight: 48,
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
              sx={{ borderLeft: border }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
