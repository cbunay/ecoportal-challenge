import { CalendarView } from "@/lib/calendar-dates";

export function generateStaticParams() {
  return [{ view: CalendarView.Month }, { view: CalendarView.Week }];
}

export default function CalendarPage() {
  return <></>;
}
