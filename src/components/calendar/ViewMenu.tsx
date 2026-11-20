"use client";

import { useParams, useRouter } from "next/navigation";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { CalendarView } from "@/lib/calendar-grid";

export function ViewMenu() {
  const { view: viewParam } = useParams<{ view: CalendarView }>();
  const view =
    viewParam === CalendarView.Week ? CalendarView.Week : CalendarView.Month;
  const router = useRouter();

  return (
    <Select
      value={view}
      variant="outlined"
      size="small"
      inputProps={{ "aria-label": "View" }}
      onChange={(event) => router.push(`/calendar/${event.target.value}`)}
      sx={{ ml: "auto", borderRadius: 999 }}
    >
      <MenuItem value={CalendarView.Month}>Month</MenuItem>
      <MenuItem value={CalendarView.Week}>Week</MenuItem>
    </Select>
  );
}
