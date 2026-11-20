import type { z } from "zod";

import type { createEventSchema, updateEventSchema } from "./event.schema";

export const EVENT_TYPES = ["meeting"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type CreateEventInput = z.infer<typeof createEventSchema>;

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export interface CalendarEvent extends CreateEventInput {
  id: string;
}
