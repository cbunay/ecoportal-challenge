"use client";

import {
  buildMonthWeeks,
  buildWeekDays,
  CalendarView,
  timeZoneOffsetLabel,
  weekHourLabels,
} from "@/lib/calendar-grid";

import { MonthGrid } from "./MonthGrid";
import { WeekGrid } from "./WeekGrid";
import { useParams } from "next/navigation";

export function CalendarBoard({ today }: { today: Date }) {
  const { view } = useParams<{ view: CalendarView }>();

  if (view === CalendarView.Week) {
    return (
      <WeekGrid
        days={buildWeekDays(today)}
        hours={weekHourLabels()}
        offsetLabel={timeZoneOffsetLabel(today)}
      />
    );
  }

  return <MonthGrid weeks={buildMonthWeeks(today)} />;
}
