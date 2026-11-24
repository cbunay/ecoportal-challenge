"use client";

import { useParams } from "next/navigation";

import { parseDateParam } from "@/lib/calendar-dates";

export function useFocusedDate() {
  const { date } = useParams<{ date?: string }>();
  return parseDateParam(date ?? null);
}
