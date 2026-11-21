"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import { useParams, useRouter } from "next/navigation";

import {
  CalendarView,
  formatDateParam,
  shiftPeriod,
} from "@/lib/calendar-grid";
import { useFocusedDate } from "@/lib/use-focused-date";

export function PeriodNav() {
  const { view } = useParams<{ view: CalendarView }>();
  const router = useRouter();
  const focusedDate = useFocusedDate();

  const go = (amount: number) =>
    router.push(
      `/calendar/${view}/${formatDateParam(shiftPeriod(focusedDate, view, amount))}`,
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
