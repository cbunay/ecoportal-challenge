import { Suspense } from "react";
import { TZDate } from "@date-fns/tz";

import { CalendarBoard } from "@/components/calendar/CalendarBoard";
import { CalendarView } from "@/lib/calendar-grid";
import { calendarTimeZone } from "@/lib/defaults";

export function generateStaticParams() {
  return [{ view: CalendarView.Month }, { view: CalendarView.Week }];
}

export default async function CalendarPage() {
  "use cache";

  const today = TZDate.tz(calendarTimeZone);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalendarBoard today={today} />
    </Suspense>
  );
}
