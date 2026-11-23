import { parseISO } from "date-fns";
import { z } from "zod";

import { EventType } from "./event.type";

export class InvalidEventError extends Error {
  readonly errors: string[];

  constructor(errors: string[]) {
    super(errors.join(". "));
    this.name = "InvalidEventError";
    this.errors = errors;
  }
}

const eventBaseSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  type: z.enum(EventType),
  startDate: z.iso.datetime({ error: "Invalid start date" }),
  endDate: z.iso.datetime({ error: "Invalid end date" }),
});

function endAfterStart(
  event: { startDate?: string; endDate?: string },
  ctx: z.RefinementCtx,
) {
  if (!event.startDate || !event.endDate) return;

  if (parseISO(event.endDate) <= parseISO(event.startDate)) {
    ctx.addIssue({
      code: "custom",
      message: "End date must be after start date",
      path: ["endDate"],
    });
  }
}

export const createEventSchema = eventBaseSchema.superRefine(endAfterStart);

export const updateEventSchema = eventBaseSchema
  .partial()
  .superRefine(endAfterStart);

const queryDateRangeSchema = z
  .object({
    start: z.iso.datetime({ error: "Invalid start date" }),
    end: z.iso.datetime({ error: "Invalid end date" }),
  })
  .superRefine((dates, ctx) => {
    if (parseISO(dates.end) <= parseISO(dates.start)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["end"],
      });
    }
  });

export function parseCreateEvent(input: unknown) {
  const result = createEventSchema.safeParse(input);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

export function parseUpdateEvent(input: unknown) {
  const result = updateEventSchema.safeParse(input);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

export function parseQueryDateRange(input: { start: string; end: string }) {
  const result = queryDateRangeSchema.safeParse(input);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
