import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { CalendarEvent } from "@/sever/event.type";

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
  }),
});

export const { useGetEventsQuery } = eventsApi;
