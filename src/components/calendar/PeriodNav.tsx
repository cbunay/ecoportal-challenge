"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  CalendarView,
  formatDateParam,
  parseDateParam,
  shiftPeriod,
} from "@/lib/calendar-grid";

export function PeriodNav() {
  const { view } = useParams<{ view: CalendarView }>();
  const router = useRouter();
  const focusedDate = parseDateParam(useSearchParams().get("date"), new Date());

  const go = (amount: number) =>
    router.push(
      `/calendar/${view}?date=${formatDateParam(shiftPeriod(focusedDate, view, amount))}`,
    );

  return (
    <>
      <IconButton aria-label="Previous" size="small" onClick={() => go(-1)}>
        <ChevronLeftIcon />
      </IconButton>
      <IconButton aria-label="Next" size="small" onClick={() => go(1)}>
        <ChevronRightIcon />
      </IconButton>
    </>
  );
}
