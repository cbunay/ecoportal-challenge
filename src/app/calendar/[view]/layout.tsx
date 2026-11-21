import { CalendarBoard } from "@/components/calendar/CalendarBoard";
import Link from "next/link";
import { type ReactNode } from "react";

export default function CalendarViewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <CalendarBoard />
      {children}
    </>
  );
}
