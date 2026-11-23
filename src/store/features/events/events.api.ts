import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from "@/sever/event.type";

type EventsRange = { start: string; end: string };

const eventList = { type: "Event", id: "LIST" } as const;

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEvents: builder.query<CalendarEvent[], EventsRange>({
      query: ({ start, end }) => ({ url: "events", params: { start, end } }),
      providesTags: [eventList],
    }),
    getEvent: builder.query<CalendarEvent, string>({
      query: (id) => `events/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Event", id }],
    }),
    createEvent: builder.mutation<CalendarEvent, CreateEventInput>({
      query: (body) => ({ url: "events", method: "POST", body }),
      invalidatesTags: [eventList],
    }),
    updateEvent: builder.mutation<
      CalendarEvent,
      { id: string; patch: UpdateEventInput }
    >({
      query: ({ id, patch }) => ({
        url: `events/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Event", id },
        eventList,
      ],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({ url: `events/${id}`, method: "DELETE" }),
      invalidatesTags: [eventList],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
