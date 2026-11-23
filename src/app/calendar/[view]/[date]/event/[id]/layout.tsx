"use client";

import { paths } from "@/lib/calendar-paths";

import { useEffect, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import { useGetEventQuery } from "@/store/features/events/events.api";

export default function EventLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { view, date, id } = useParams<{
    view: string;
    date: string;
    id: string;
  }>();
  const { isError, error } = useGetEventQuery(id);

  useEffect(() => {
    if (!isError) return;
    const notFound = (error as { status?: number }).status === 404;
    enqueueSnackbar(notFound ? "Event not found" : "Could not load the event", {
      variant: "error",
    });
    router.replace(paths.calendarDate(view, date));
  }, [isError, error, enqueueSnackbar, router, view, date]);

  return isError ? null : children;
}
