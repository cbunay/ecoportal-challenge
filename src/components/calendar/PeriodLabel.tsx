"use client";

import Typography from "@mui/material/Typography";

import { formatPeriodLabel } from "@/lib/calendar-grid";
import { CalendarView } from "@/lib/calendar-grid";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function PeriodLabel() {
  const { view } = useParams<{ view: CalendarView }>();
  const today = useAppSelector((state) => state.calendar.today);

  return (
    <Typography
      component="h1"
      sx={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}
    >
      {formatPeriodLabel(new Date(today), view)}
    </Typography>
  );
}
