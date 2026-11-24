"use client";

import { formatDayLabel } from "@/lib/calendar-dates";
import { MonthDay } from "@/lib/calendar-layout";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BAR_HEIGHT } from "../event/EventBar";
import type { ReactNode } from "react";

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
      aria-label={formatDayLabel(day.key)}
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
          color: day.isToday ? "#fff" : day.inMonth ? "#3c4043" : "#70757a",
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
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gridTemplateRows: `28px repeat(${lanes}, ${BAR_HEIGHT}px) 1fr`,
        rowGap: "2px",
        "&:not(:last-of-type)": { borderBottom: "1px solid #e6e8ec" },
      }}
    >
      {children}
    </Box>
  );
}
