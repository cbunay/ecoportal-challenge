import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
//import { Calendar } from "./Calendar";

// function renderCalendar() {
//   render(
//     <ThemeProvider theme={theme}>
//       <Calendar dateLabel="November 2026" />
//     </ThemeProvider>,
//   );
// }

// describe("Calendar", () => {
//   it("renders the calendar shell", () => {
//     renderCalendar();

//     expect(screen.getByRole("navigation", { name: "Sidebar" })).toBeVisible();
//     expect(screen.getByText("Calendar")).toBeVisible();
//     expect(screen.getByRole("button", { name: "Create" })).toBeVisible();
//     expect(screen.getByRole("toolbar", { name: "Toolbar" })).toBeVisible();
//     expect(screen.getByRole("button", { name: "Today" })).toBeVisible();
//     expect(screen.getByRole("combobox", { name: "View" })).toBeVisible();
//     expect(screen.getByRole("main")).toHaveTextContent("Calendar content");
//   });
// });
