import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { calendarTimeZone } from "@/lib/defaults";
import type { CalendarEvent } from "@/sever/event.type";

export type EventDraft = { date: string; startTime?: string };

export type CalendarState = {
  timeZone: string;
  selectedEvent: CalendarEvent | null;
  draftEvent: EventDraft | null;
};

const initialState: CalendarState = {
  timeZone: calendarTimeZone,
  selectedEvent: null,
  draftEvent: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    selectEvent(state, action: PayloadAction<CalendarEvent>) {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null;
    },
    setDraftEvent(state, action: PayloadAction<EventDraft>) {
      state.draftEvent = action.payload;
    },
    clearDraftEvent(state) {
      state.draftEvent = null;
    },
  },
});

export const {
  selectEvent,
  clearSelectedEvent,
  setDraftEvent,
  clearDraftEvent,
} = calendarSlice.actions;
export const calendarReducer = calendarSlice.reducer;
