const guayaquilTimeZone = "America/Guayaquil";

// Unset means follow the viewer's zone.
export const calendarTimeZone =
  process.env.NEXT_PUBLIC_CALENDAR_TIME_ZONE ||
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const testTimeZone = process.env.TZ || guayaquilTimeZone;
