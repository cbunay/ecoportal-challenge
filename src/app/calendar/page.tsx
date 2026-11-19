import { Suspense } from "react";
import { Calendar } from "@/components/calendar/Calendar";
import { CurrentMonth } from "@/components/calendar/CurrentMonth";

export default function CalendarPage() {
  return (
    <Calendar
      dateLabel={
        <Suspense fallback={<span aria-hidden>&nbsp;</span>}>
          <CurrentMonth />
        </Suspense>
      }
    />
  );
}
