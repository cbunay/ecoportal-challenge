import { tzDate } from "@/lib/calendar-dates";
import { draftSlot } from "@/lib/calendar-layout";
import { makeStore } from "@/store/store";
import theme from "@/theme/theme";
import type { CalendarEvent } from "@/sever/event.type";
import { EventType } from "@/sever/event.type";
import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MonthGrid } from "./MonthGrid";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ view: "month" }),
  useRouter: () => ({ push }),
}));

const focusedDate = tzDate(2026, 11, 18);

const standup: CalendarEvent = {
  id: "event-1",
  name: "Standup",
  type: EventType.Meeting,
  startDate: tzDate(2026, 11, 17, 9).toISOString(),
  endDate: tzDate(2026, 11, 17, 10).toISOString(),
};

const conference: CalendarEvent = {
  id: "event-2",
  name: "Conference",
  type: EventType.Meeting,
  startDate: tzDate(2026, 11, 20, 9).toISOString(),
  endDate: tzDate(2026, 11, 24, 17).toISOString(),
};

function renderMonth(events: CalendarEvent[] = []) {
  render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <MonthGrid focusedDate={focusedDate} events={events} />
      </ThemeProvider>
    </Provider>,
  );
}

describe("MonthGrid", () => {
  beforeEach(() => push.mockClear());

  it("renders the MonthGrid headers and every day of the visible weeks", () => {
    renderMonth();

    expect(
      screen.getAllByRole("columnheader").map((h) => h.textContent),
    ).toEqual(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]);
    expect(screen.getAllByRole("row")).toHaveLength(5);
    expect(screen.getAllByRole("gridcell")).toHaveLength(35);
    expect(screen.getByText("Nov 1")).toBeVisible();
    expect(screen.getByText("Dec 1")).toBeVisible();
  });

  it("renders an event with its start time", () => {
    renderMonth([standup]);

    expect(screen.getByTitle("Standup")).toHaveTextContent("9:00 AM Standup");
  });

  it("renders two bars for a multi-day event", () => {
    renderMonth([conference]);

    const bars = screen.getAllByTitle("Conference");
    expect(bars).toHaveLength(2);

    for (const bar of bars) expect(bar).toHaveTextContent(/^Conference$/);
  });

  it("navigates to the event details when an event is clicked", async () => {
    renderMonth([standup]);

    await userEvent.click(screen.getByTitle("Standup"));

    expect(push).toHaveBeenCalledWith(
      "/calendar/month/2026-11-18/event/event-1",
    );
  });

  describe("creating an event from a day", () => {
    it.each([
      ["Sunday, November 1", "2026-11-01"],
      ["Wednesday, November 18", "2026-11-18"],
      ["Thursday, December 3", "2026-12-03"],
    ])("navigates to the new-event route for %s", async (cell, date) => {
      renderMonth();

      await userEvent.click(screen.getByRole("gridcell", { name: cell }));

      const slot = draftSlot({ date });
      expect(push).toHaveBeenCalledWith(
        `/calendar/month/2026-11-18/event/new?slot=${slot}`,
      );
    });
  });
});
