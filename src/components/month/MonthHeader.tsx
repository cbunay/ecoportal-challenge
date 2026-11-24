import { MonthDay } from "@/lib/calendar-layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function MonthHeader({ days }: { days: MonthDay[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
      }}
    >
      {days.map((day) => (
        <Typography
          key={day.weekday}
          role="columnheader"
          sx={{
            paddingTop: ".5rem",
            textAlign: "center",
            fontSize: 11,
            fontWeight: 400,
            borderRight: "1px solid #e6e8ec",
            color: "#70757a",
            "&:last-of-type": { borderRight: "none" },
          }}
        >
          {day.weekday}
        </Typography>
      ))}
    </Box>
  );
}
