import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { calendarTimeZone } from "@/lib/defaults";
import type { CalendarEvent } from "@/sever/event.type";

export type EventDraft = {
  date: string;
  startTime?: string;
  endTime?: string;
  name?: string;
};

export type CalendarState = {
  timeZone: string;
  activeEvent: CalendarEvent | null;
  draftEvent: EventDraft | null;
};

const initialState: CalendarState = {
  timeZone: calendarTimeZone,
  activeEvent: null,
  draftEvent: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    selectEvent(state, action: PayloadAction<CalendarEvent>) {
      state.activeEvent = action.payload;
    },
    clearActiveEvent(state) {
      state.activeEvent = null;
    },
    setDraftEvent(state, action: PayloadAction<EventDraft>) {
      state.draftEvent = action.payload;
    },
    clearDraftEvent(state) {
      state.draftEvent = null;
    },
  },
  selectors: {
    selectActiveEvent: (state) => state.activeEvent,
    selectDraftEvent: (state) => state.draftEvent,
  },
});

export const { selectEvent, clearActiveEvent, setDraftEvent, clearDraftEvent } =
  calendarSlice.actions;
export const { selectActiveEvent, selectDraftEvent } = calendarSlice.selectors;
export const calendarReducer = calendarSlice.reducer;
