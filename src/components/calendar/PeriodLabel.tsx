"use client";

import Typography from "@mui/material/Typography";

import {
  CalendarView,
  formatPeriodLabel,
  parseDateParam,
} from "@/lib/calendar-grid";
import { useParams, useSearchParams } from "next/navigation";

export function PeriodLabel() {
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = parseDateParam(useSearchParams().get("date"), new Date());

  return (
    <Typography
      component="h1"
      sx={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}
    >
      {formatPeriodLabel(focusedDate, view)}
    </Typography>
  );
}
