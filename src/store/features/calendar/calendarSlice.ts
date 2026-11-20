import { TZDate } from "@date-fns/tz";
import { createSlice } from "@reduxjs/toolkit";

import { calendarTimeZone } from "@/lib/defaults";

export type CalendarState = {
  timeZone: string;
  today: string;
};

const initialState: CalendarState = {
  timeZone: calendarTimeZone,
  today: new Date().toISOString(),
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
});

export const calendarReducer = calendarSlice.reducer;
