import { configureStore } from "@reduxjs/toolkit";
import { calendarReducer } from "./features/calendar/calendar.slice";
import { eventsApi } from "./features/events/events.api";

export const makeStore = () =>
  configureStore({
    reducer: {
      calendar: calendarReducer,
      [eventsApi.reducerPath]: eventsApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(eventsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
