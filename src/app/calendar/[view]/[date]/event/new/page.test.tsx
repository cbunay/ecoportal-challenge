import CreateEventPage from "./page";
import { WeekGrid } from "@/components/week/WeekGrid";
import { tzDate } from "@/lib/calendar-dates";
import { makeStore } from "@/store/store";
import theme from "@/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ view: "week", date: "2026-11-18" }),
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
}));

function renderWithStore(
  store: ReturnType<typeof makeStore>,
  ui: React.ReactNode,
) {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>{ui}</SnackbarProvider>
      </ThemeProvider>
    </Provider>,
  );
}

describe("CreateEventPage", () => {
  it("opens prefilled with the hour clicked in the week grid", async () => {
    const store = makeStore();
    const grid = renderWithStore(
      store,
      <WeekGrid focusedDate={tzDate(2026, 11, 18, 12)} />,
    );

    await userEvent.click(
      screen.getByRole("gridcell", { name: "Sunday, November 15, 9 AM" }),
    );
    grid.unmount();

    // The grid hands the slot to the page through the store.
    renderWithStore(store, <CreateEventPage />);

    const dialog = screen.getByRole("dialog");
    const field = (name: string) =>
      dialog.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    expect(dialog).toBeVisible();
    expect(field("date")).toHaveValue("2026-11-15");
    expect(field("startTime")).toHaveValue("09:00");
    expect(field("endTime")).toHaveValue("10:00");
  });
});
