import { tz } from "@date-fns/tz";
import { format } from "date-fns";

import { calendarTimeZone } from "@/lib/defaults";

const inTimeZone = tz(calendarTimeZone);

export function formatToolbarDate(date: Date) {
  return format(date, "MMMM yyyy", { in: inTimeZone });
}
