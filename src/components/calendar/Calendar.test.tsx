import { tzDate } from "@/lib/calendar-dates";
import { testTimeZone } from "@/lib/defaults";
import { makeStore } from "@/store/store";
import theme from "@/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { Provider } from "react-redux";
import { CalendarSidebar } from "./CalendarSidebar";
import { CalendarToolbar } from "./CalendarToolbar";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ view: "month", date: "2026-11-15" }),
  useRouter: () => ({ push }),
}));

function renderCalendar() {
  render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <CalendarSidebar />
        <CalendarToolbar />
      </ThemeProvider>
    </Provider>,
  );
}

describe("Calendar", () => {
  beforeEach(() => push.mockClear());

  it("renders the calendar shell", () => {
    renderCalendar();

    expect(screen.getByText("Calendar")).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Sidebar" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Create" })).toBeVisible();
    expect(screen.getByRole("toolbar", { name: "Toolbar" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Today" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Previous" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Next" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "View Picker" })).toBeVisible();
    expect(screen.getByText("November 2026")).toBeVisible();
  });

  it("navigates to the next period and to today", async () => {
    renderCalendar();

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(push).toHaveBeenLastCalledWith("/calendar/month/2026-12-15");

    await userEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(push).toHaveBeenLastCalledWith("/calendar/month");
  });

  it("uses the time zone configured in the environment", () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(testTimeZone);
  });

  it("creates a date as local midnight in the calendar time zone", () => {
    const date = tzDate(2026, 11, 23);
    expect(format(date, "yyyy-MM-dd")).toBe("2026-11-23");
  });
});
