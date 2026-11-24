# ecoPortal calendar

Month and week views for meetings, with create, edit, and delete. Both grids are React components in this repo.

`/calendar` redirects to `/calendar/month`. A missing or invalid date opens today. The date segment is `yyyy-MM-dd`.

## Setup

Next.js requires Node.js 20.9.0 or newer.

```bash
npm install && npm run dev
```

The dev server runs at http://localhost:3000/calendar.

| Variable | Default | Effect |
|---|---|---|
| `NEXT_PUBLIC_CALENDAR_TIME_ZONE` | `Intl.DateTimeFormat().resolvedOptions().timeZone` | Zone used to place a meeting on a day and an hour |
| `SEED_EVENTS_FILE` | `data/events.json` | JSON file read into memory when the server process starts |

## Usage

### First screen

`/calendar/month` shows the current month. The four seed meetings are in June 2026, so that grid is empty until you move to June or create a meeting.

### Move around

- Previous and Next move one month in Month, and one week in Week. The URL becomes `/calendar/<view>/<yyyy-MM-dd>`.
- Today opens `/calendar/<view>`, which is today.
- The view picker keeps the date already in the URL. With no date, the other view opens on today.
- The week starts on Sunday.

### Create

- Create, then Meeting, opens `/calendar/<view>/<focused day>/event/new`. The start is the next clock hour. The end is one hour later, on the same day.
- An empty month cell uses that cell's date and the same next-hour default.
- An empty week hour starts at that hour at `:00` and ends one hour later.
- Save sends `POST /api/events` and shows "Event created".
- An empty name shows "Name is required". An end that is not later shows "End must be after start". A name longer than 120 characters is rejected.
- Close discards the draft and returns to the grid.

### Edit and delete

- Click a meeting to open `/calendar/<view>/<date>/event/<id>`.
- Edit event opens `.../edit`. Save sends `PATCH /api/events/<id>` and shows "Event updated". This form has an end date, so the meeting can span days.
- Remove event sends `DELETE /api/events/<id>` and shows "Event deleted".
- A failed delete shows "Could not delete the event" and keeps the meeting.
- Reload shows the same meetings until the Node process exits.

### Month grid

- A one-day meeting is a bar with its start time and name.
- A meeting that crosses days is a bar across those cells. It continues on the next row when it crosses a week.
- Days outside the current month are dimmed. Clicking one opens the create form on that date.

### Week grid

- The grid has 24 rows, from 12 AM through 11 PM, plus the GMT offset.
- A one-day meeting is a block. Its top and height follow the start and the duration. The block is at least 22px tall.
- A multi-day meeting is a bar above the hour rows.
- Overlapping blocks share the day column. Each later block starts further right and stays wide enough to click.

## Tests

```bash
npm test
npx playwright install chromium && npm run test:e2e
```

`npm test` runs Jest and Testing Library.

- `src/components/calendar/Calendar.test.tsx` checks the shell, Next, Today, and the configured time zone.
- `src/components/month/MonthGrid.test.tsx` checks the Sunday-first headers, the 35 visible cells, the start time on a bar, two bars for a multi-day meeting, and the routes for open and create.
- `src/components/week/WeekGrid.test.tsx` checks seven days, 24 hours, the GMT offset, a timed block, a multi-day bar, and the routes for open and create.

`npm run test:e2e` runs Playwright on Chromium. The Playwright server sets `TZ=America/Guayaquil` and `SEED_EVENTS_FILE=data/eventsEmp.json`. The browser timezone is `America/Guayaquil`. Workers share that one server list, so each meeting name is unique.

- `e2e/health.spec.ts` loads the calendar.
- `e2e/browse.spec.ts` checks today, switching views, and month navigation.
- `e2e/create.spec.ts` creates from the menu and from the grid in both views, rejects an empty name and a bad range, and discards a draft.
- `e2e/edit.spec.ts` moves a meeting to another day and rejects an empty name on rename.
- `e2e/delete.spec.ts` checks that a removed meeting stays gone, and that a failed delete keeps it.
- `e2e/month.spec.ts` checks a three-day bar, overlapping meetings, 22:00 on the last day of the month, and 00:30 on the first day.
- `e2e/week.spec.ts` checks a 09:00 to 10:30 block, an overnight meeting, overlapping meetings, and a week that contains two months.

`npm run lint` runs ESLint.

## Assumptions and decisions

- This exercise is the calendar UI. There is no database and no separate API service. `src/app/api/events` is a Next.js route handler in this process. It reads and writes an in-memory array so the screens can load, create, edit, and delete meetings.
- The UI uses Next.js App Router, React, TypeScript, MUI, Redux Toolkit with RTK Query, Zod, react-hook-form, and date-fns. Date math uses `date-fns` and `@date-fns/tz`. No calendar component library draws the grids.
- A meeting is `{ id, type, name, startDate, endDate }`. `type` is the `EventType.Meeting` value `"meeting"`. `name` is trimmed, required, and at most 120 characters. `startDate` and `endDate` are ISO-8601 instants, and the end must be later.
- New ids are `evt-` plus `crypto.randomUUID()`. The client loads a range with `GET /api/events?start=&end=`. One bound without the other returns 400.
- `data/events.json` is the seed, read once at startup. The client does not import it. The four meetings are Weekly safety briefing (22 June 2026, 09:00 to 09:30 UTC), Site A weekly walkthrough (23 June, 14:30 to 15:30 UTC), Contractor toolbox talk (24 June, 09:00 to 10:00 UTC), and Quarterly site audit (26 June, 13:00 to 15:00 UTC).
- The open period and the open dialog are URL segments. Refresh and Back return to that URL. RTK Query refetches the visible range after a successful POST, PATCH, or DELETE.
- `src/lib/calendar-layout.ts` returns the bars and blocks. `MonthGrid` and `WeekGrid` render that result.

## Known limitations and areas for future improvement

- A restart drops every create, edit, and delete. The handlers do not write `data/events.json`.
- The array lives in one Node process. A second process has its own copy.
- There is no sign-in. A meeting has no attendees, recurrence, reminders, or search.
- A week block cannot be dragged to a new time. `DraggableDialog` drags the dialog only.
- The create form has a start date, a start time, and an end time. It has no end-date field, so a meeting created there stays on one day.
- The grid uses the machine zone unless `NEXT_PUBLIC_CALENDAR_TIME_ZONE` is set. 09:00 UTC on 22 June 2026 is 21:00 in Pacific/Auckland.
- Playwright workers share one list. A test cannot require an empty calendar.

## How I would enhance or refactor the architecture

- Keep `findByDateRange`, `create`, `update`, and `delete` on `server/event.repository.ts`. Replace the module-level array with a database that implements those four functions. Leave the route handlers and the grids on the same fields.
- Build that repository when the process starts, from `SEED_EVENTS_FILE`, and pass it into the service. A test can then construct its own repository instead of sharing the module array.
- Add a day view as a new route and a new component that calls `calendar-layout.ts`. Leave `MonthGrid` and `WeekGrid` unchanged.
- Add a field on `createEventSchema` and on the form. The grids still read `name`, `startDate`, and `endDate`.
- Point the `@/sever/*` alias at `./server/*` under the name `@/server/*`.

## Features or improvements I would prioritise next

1. Persist meetings through the repository change above. A restart then keeps creates, edits, and deletes.
2. Set `NEXT_PUBLIC_CALENDAR_TIME_ZONE=Pacific/Auckland` so the June seed shows the same clock time on every machine.
3. Drag a week block to a new start and end, and send that range with the existing PATCH handler.
4. Add a second `EventType` to the Create menu and the chip. Put any new fields on the Zod schema.
5. Give overlapping week blocks side-by-side columns, and operate the grids from the keyboard.

## Layout

- `src/app/calendar/page.tsx` redirects `/calendar` to `/calendar/month`.
- `src/app/calendar/[view]` and `[view]/[date]` render the grid. `event/new`, `event/[id]`, and `event/[id]/edit` are the dialogs.
- `src/app/api/events/route.ts` implements GET and POST. `src/app/api/events/[id]/route.ts` implements GET, PATCH, and DELETE.
- `src/components/month` and `src/components/week` are the grids. `src/components/event` is the bar and the block. `src/components/calendar` is the toolbar, the sidebar, and the dialog shell.
- `src/lib/calendar-dates.ts` handles the zone, the week, and the URL date. `src/lib/calendar-layout.ts` handles placement. `src/lib/calendar-paths.ts` builds the routes.
- `src/store/features/events/events.api.ts` is the RTK Query client. `src/store/features/calendar/calendar.slice.ts` holds the create draft.
- `server/event.schema.ts`, `server/event.service.ts`, and `server/event.repository.ts` validate, coordinate, and store meetings.
- `data/events.json` is the seed. `e2e` holds the Playwright tests.
