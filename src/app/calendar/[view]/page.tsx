import { CalendarBoard } from "@/components/calendar/CalendarBoard";
import { CalendarView } from "@/lib/calendar-grid";

export function generateStaticParams() {
  return [{ view: CalendarView.Month }, { view: CalendarView.Week }];
}

export default function CalendarPage() {
  return <CalendarBoard />;
}
