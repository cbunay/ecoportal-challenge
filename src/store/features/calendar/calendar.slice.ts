import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { calendarTimeZone } from "@/lib/defaults";
import type { CalendarEvent } from "@/sever/event.type";

export type CalendarState = {
  timeZone: string;
  selectedEvent: CalendarEvent | null;
};

const initialState: CalendarState = {
  timeZone: calendarTimeZone,
  selectedEvent: null,
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
  },
});

export const { selectEvent, clearSelectedEvent } = calendarSlice.actions;
export const calendarReducer = calendarSlice.reducer;
