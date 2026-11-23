const guayaquilTimeZone = "America/Guayaquil";

export const calendarTimeZone =
  process.env.NEXT_PUBLIC_CALENDAR_TIME_ZONE ||
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const testTimeZone = process.env.TZ || guayaquilTimeZone;
