export const paths = {
  home: () => `/calendar/month`,

  calendarToday: (view: string) => `/calendar/${view}`,

  calendarDate: (view: string, date: string) => `/calendar/${view}/${date}`,

  eventDetails: (view: string, date: string, id: string) =>
    `/calendar/${view}/${date}/event/${id}`,

  eventEdit: (view: string, date: string, id: string) =>
    `/calendar/${view}/${date}/event/${id}/edit`,

  eventCreate: (view: string, date: string, slot: number) =>
    `/calendar/${view}/${date}/event/new?slot=${slot}`,
};
