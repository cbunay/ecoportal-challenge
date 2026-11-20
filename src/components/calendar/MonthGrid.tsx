import type { MonthDay } from "@/lib/calendar-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const border = "1px solid #e6e8ec";

const labelColor = (day: MonthDay) => (day.inMonth ? "#3c4043" : "#70757a");

export function MonthGrid({ weeks }: { weeks: MonthDay[][] }) {
  return (
    <Stack direction="column" sx={{ flex: 1 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
        }}
      >
        {weeks[0]?.map((day) => (
          <Typography
            key={day.weekday}
            role="columnheader"
            sx={{
              paddingTop: ".5rem",
              textAlign: "center",
              fontSize: 11,
              fontWeight: 400,
              borderRight: border,
              color: "#70757a",
              "&:last-of-type": { borderRight: "none" },
            }}
          >
            {day.weekday}
          </Typography>
        ))}
      </Box>
      {weeks.map((week) => (
        <Box
          key={week[0]?.key}
          role="row"
          sx={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            "&:not(:last-of-type)": { borderBottom: border },
          }}
        >
          {week.map((day) => (
            <Stack
              key={day.key}
              role="gridcell"
              aria-current={day.isToday ? "date" : undefined}
              sx={{
                minWidth: 0,
                p: "0 1rem 1rem 1rem",
                alignItems: "center",
                borderRight: border,
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
          ))}
        </Box>
      ))}
    </Stack>
  );
}
