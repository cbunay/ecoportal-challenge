"use client";

import Button from "@mui/material/Button";
import { useParams, useRouter } from "next/navigation";

import { CalendarView } from "@/lib/calendar-grid";

export function TodayButton() {
  const { view } = useParams<{ view: CalendarView }>();
  const router = useRouter();

  return (
    <Button variant="outlined" onClick={() => router.push(`/calendar/${view}`)}>
      Today
    </Button>
  );
}
