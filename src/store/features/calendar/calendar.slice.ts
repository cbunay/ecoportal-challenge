import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { calendarTimeZone } from "@/lib/defaults";

export type EventDraft = {
  date: string;
  startTime?: string;
  endTime?: string;
  name?: string;
};

export type CalendarState = {
  timeZone: string;
  draftEvent: EventDraft | null;
};

const initialState: CalendarState = {
  timeZone: calendarTimeZone,
  draftEvent: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setDraftEvent(state, action: PayloadAction<EventDraft>) {
      state.draftEvent = action.payload;
    },
    clearDraftEvent(state) {
      state.draftEvent = null;
    },
  },
  selectors: {
    selectDraftEvent: (state) => state.draftEvent,
  },
});

export const { setDraftEvent, clearDraftEvent } = calendarSlice.actions;
export const { selectDraftEvent } = calendarSlice.selectors;
export const calendarReducer = calendarSlice.reducer;
