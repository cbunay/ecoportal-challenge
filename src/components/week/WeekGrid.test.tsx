import { tzDate } from "@/lib/calendar-dates";
import { makeStore } from "@/store/store";
import theme from "@/theme/theme";
import type { CalendarEvent } from "@/sever/event.type";
import { EventType } from "@/sever/event.type";
import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { WeekGrid } from "./WeekGrid";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ view: "week" }),
  useRouter: () => ({ push }),
}));

// Wednesday 18 Nov 2026; the week runs Sun 15 – Sat 21.
const focusedDate = tzDate(2026, 11, 18, 12);

const standup: CalendarEvent = {
  id: "standup",
  name: "Standup",
  type: EventType.Meeting,
  startDate: tzDate(2026, 11, 17, 9).toISOString(),
  endDate: tzDate(2026, 11, 17, 10).toISOString(),
};

const offsite: CalendarEvent = {
  id: "offsite",
  name: "Offsite",
  type: EventType.Meeting,
  startDate: tzDate(2026, 11, 16, 9).toISOString(),
  endDate: tzDate(2026, 11, 18, 17).toISOString(),
};

function renderWeek(events: CalendarEvent[] = []) {
  render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <WeekGrid focusedDate={focusedDate} events={events} />
      </ThemeProvider>
    </Provider>,
  );
}

describe("WeekGrid", () => {
  beforeEach(() => push.mockClear());

  it("renders the seven days of the week, the hours and the GMT offset", () => {
    renderWeek();

    expect(screen.getByRole("grid", { name: "Week" })).toBeVisible();
    expect(screen.getByText("GMT-5")).toBeVisible();
    for (const weekday of ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]) {
      expect(screen.getByText(weekday)).toBeVisible();
    }
    expect(screen.getByText("12 AM")).toBeVisible();
    expect(screen.getByText("11 PM")).toBeVisible();
    expect(screen.getAllByRole("gridcell")).toHaveLength(7 * 24);
  });

  it("renders a timed event as an hour block", () => {
    renderWeek([standup]);

    expect(screen.getByTitle("Standup, 9:00 AM")).toBeVisible();
  });

  it("renders a multi-day event as a bar, not an hour block", () => {
    renderWeek([offsite]);

    expect(screen.getByTitle("Offsite")).toBeVisible();
    expect(screen.queryByTitle("Offsite, 9:00 AM")).not.toBeInTheDocument();
  });

  it("renders no event bars when there are no multi-day events", () => {
    renderWeek([standup]);

    expect(screen.queryByTitle("Standup")).not.toBeInTheDocument();
  });

  it("navigates to the event details when a block or a bar is clicked", async () => {
    renderWeek([standup, offsite]);

    await userEvent.click(screen.getByTitle("Standup, 9:00 AM"));
    await userEvent.click(screen.getByTitle("Offsite"));

    expect(push.mock.calls).toEqual([
      ["/calendar/week/2026-11-18/event/standup"],
      ["/calendar/week/2026-11-18/event/offsite"],
    ]);
  });

  describe("creating an event from a day", () => {
    it.each([
      ["Sunday, November 15, 12 AM", [2026, 11, 15, 0]],
      ["Wednesday, November 18, 9 AM", [2026, 11, 18, 9]],
      ["Saturday, November 21, 11 PM", [2026, 11, 21, 23]],
    ] as const)(
      "navigates to the new-event route for %s",
      async (cell, [year, month, day, hour]) => {
        renderWeek();

        await userEvent.click(screen.getByRole("gridcell", { name: cell }));

        const slot = tzDate(year, month, day, hour).getTime();
        expect(push).toHaveBeenCalledWith(
          `/calendar/week/2026-11-18/event/new?slot=${slot}`,
        );
      },
    );
  });
});
