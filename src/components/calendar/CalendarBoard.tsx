"use client";

import {
  buildMonthWeeks,
  buildWeekDays,
  CalendarView,
  parseDateParam,
  timeZoneOffsetLabel,
  weekHourLabels,
} from "@/lib/calendar-grid";

import { MonthGrid } from "./MonthGrid";
import { WeekGrid } from "./WeekGrid";
import { useParams, useSearchParams } from "next/navigation";

export function CalendarBoard() {
  const today = new Date();
  const { view } = useParams<{ view: CalendarView }>();
  const focusedDate = parseDateParam(useSearchParams().get("date"), today);

  if (view === CalendarView.Week) {
    return (
      <WeekGrid
        days={buildWeekDays(focusedDate, today)}
        hours={weekHourLabels()}
        offsetLabel={timeZoneOffsetLabel(today)}
      />
    );
  }

  return <MonthGrid weeks={buildMonthWeeks(focusedDate, today)} />;
}
