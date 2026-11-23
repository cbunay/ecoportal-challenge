import type { MonthDay } from "@/lib/calendar-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BAR_HEIGHT } from "../event/EventBar";
import type { ReactNode } from "react";

export const MONTH_COLUMNS = "repeat(7, minmax(0, 1fr))";
export const DAY_LABEL_HEIGHT = 28;

const labelColor = (day: MonthDay) => (day.inMonth ? "#3c4043" : "#70757a");

export function DayCell({
  day,
  column,
  onClick,
}: {
  day: MonthDay;
  column: number;
  onClick: () => void;
}) {
  return (
    <Stack
      role="gridcell"
      aria-current={day.isToday ? "date" : undefined}
      onClick={onClick}
      sx={{
        gridColumn: column,
        gridRow: "1 / -1",
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

export function WeekRow({
  lanes,
  children,
}: {
  lanes: number;
  children: ReactNode;
}) {
  return (
    <Box
      role="row"
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: MONTH_COLUMNS,
        gridTemplateRows: `${DAY_LABEL_HEIGHT}px repeat(${lanes}, ${BAR_HEIGHT}px) 1fr`,
        rowGap: "2px",
        "&:not(:last-of-type)": { borderBottom: "1px solid #e6e8ec" },
      }}
    >
      {children}
    </Box>
  );
}
