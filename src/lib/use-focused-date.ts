"use client";

import { useParams } from "next/navigation";

import { parseDateParam } from "@/lib/calendar-grid";

export function useFocusedDate() {
  const { date } = useParams<{ date?: string }>();
  return parseDateParam(date ?? null);
}
