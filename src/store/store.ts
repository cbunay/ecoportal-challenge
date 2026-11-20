import { configureStore } from "@reduxjs/toolkit";
import { calendarReducer } from "./features/calendar/calendar.slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      calendar: calendarReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
