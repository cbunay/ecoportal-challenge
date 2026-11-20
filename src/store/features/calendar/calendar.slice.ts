import { createSlice } from "@reduxjs/toolkit";

import { calendarTimeZone } from "@/lib/defaults";

export type CalendarState = {
  timeZone: string;
};

const initialState: CalendarState = {
  timeZone: calendarTimeZone,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
});

export const calendarReducer = calendarSlice.reducer;
