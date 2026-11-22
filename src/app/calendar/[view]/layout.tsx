import { CalendarBoard } from "@/components/calendar/CalendarBoard";
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
