import { format } from "date-fns";

export function formatToolbarDate(date: Date) {
  return format(date, "MMMM yyyy");
}
