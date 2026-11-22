import "server-only";

import { parseISO } from "date-fns";

import initialEvents from "@/data/events.json";

import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from "./event.type";

const events: CalendarEvent[] = structuredClone(initialEvents) as CalendarEvent[];

export const eventRepository = {
  async findAll(): Promise<CalendarEvent[]> {
    return [...events];
  },

  async findById(id: string): Promise<CalendarEvent | null> {
    return events.find((event) => event.id === id) ?? null;
  },

  async findByDateRange(start: string, end: string): Promise<CalendarEvent[]> {
    const rangeStart = parseISO(start).getTime();
    const rangeEnd = parseISO(end).getTime();

    return events
      .filter((event) => {
        const eventStart = parseISO(event.startDate).getTime();
        const eventEnd = parseISO(event.endDate).getTime();

        return eventStart < rangeEnd && eventEnd > rangeStart;
      })
      .sort(
        (a, b) =>
          parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime(),
      );
  },

  async create(data: CreateEventInput): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = {
      id: `evt-${crypto.randomUUID()}`,
      ...data,
    };

    events.push(newEvent);

    return newEvent;
  },

  async update(
    id: string,
    data: UpdateEventInput,
  ): Promise<CalendarEvent | null> {
    const index = events.findIndex((event) => event.id === id);

    if (index === -1) return null;

    events[index] = {
      ...events[index],
      ...data,
    };

    return events[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = events.findIndex((event) => event.id === id);

    if (index === -1) return false;

    events.splice(index, 1);

    return true;
  },
};
