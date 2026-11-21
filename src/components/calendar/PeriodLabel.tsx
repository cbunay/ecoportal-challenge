"use client";

import Typography from "@mui/material/Typography";

import { CalendarView, formatPeriodLabel } from "@/lib/calendar-grid";
import { useFocusedDate } from "@/lib/use-focused-date";
import { useParams } from "next/navigation";

export function PeriodLabel() {
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = useFocusedDate();

  return (
    <Typography
      component="h1"
      sx={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}
    >
      {formatPeriodLabel(focusedDate, view)}
    </Typography>
  );
}
