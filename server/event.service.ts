import { eventRepository } from "@/sever/event.repository";

import {
  InvalidEventError,
  parseCreateEvent,
  parseQueryDateRange,
  parseUpdateEvent,
} from "./event.schema";

export const eventService = {
  async getEvents(start?: string, end?: string) {
    if (!start && !end) {
      return eventRepository.findAll();
    }

    if (!start || !end) {
      throw new InvalidEventError(["Both start and end are required"]);
    }

    const range = parseQueryDateRange({ start, end });

    return eventRepository.findByDateRange(range.start, range.end);
  },

  async getEvent(id: string) {
    return eventRepository.findById(id);
  },

  async createEvent(data: unknown) {
    const event = parseCreateEvent(data);

    return eventRepository.create(event);
  },

  async updateEvent(id: string, data: unknown) {
    const existing = await eventRepository.findById(id);

    if (!existing) return null;

    const patch = parseUpdateEvent(data);

    parseCreateEvent({
      type: patch.type ?? existing.type,
      name: patch.name ?? existing.name,
      startDate: patch.startDate ?? existing.startDate,
      endDate: patch.endDate ?? existing.endDate,
    });

    return eventRepository.update(id, patch);
  },

  async deleteEvent(id: string) {
    return eventRepository.delete(id);
  },
};
