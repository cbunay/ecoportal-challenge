import { CalendarView, formatPeriodLabel } from "@/lib/calendar-grid";

export function formatToolbarDate(date: Date) {
  return formatPeriodLabel(date, CalendarView.Month);
}
