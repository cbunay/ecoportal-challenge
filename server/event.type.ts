import type { z } from "zod";

import type { createEventSchema, updateEventSchema } from "./event.schema";

export enum EventType {
  Meeting = "meeting",
}

export type CreateEventInput = z.infer<typeof createEventSchema>;

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export interface CalendarEvent extends CreateEventInput {
  id: string;
}
