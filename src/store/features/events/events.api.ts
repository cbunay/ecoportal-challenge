import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from "@/sever/event.type";

export type EventsRange = { start: string; end: string };

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEvents: builder.query<CalendarEvent[], EventsRange>({
      query: ({ start, end }) => ({ url: "events", params: { start, end } }),
      providesTags: ["Event"],
    }),
    getEvent: builder.query<CalendarEvent, string>({
      query: (id) => `events/${id}`,
      providesTags: ["Event"],
    }),
    createEvent: builder.mutation<CalendarEvent, CreateEventInput>({
      query: (body) => ({ url: "events", method: "POST", body }),
      invalidatesTags: ["Event"],
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
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({ url: `events/${id}`, method: "DELETE" }),
      invalidatesTags: ["Event"],
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
