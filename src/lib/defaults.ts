const guayaquilTimeZone = "America/Guayaquil";

export const calendarTimeZone =
  process.env.CALENDAR_TIME_ZONE || guayaquilTimeZone;

export const testTimeZone = process.env.TZ || guayaquilTimeZone;
