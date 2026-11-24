import { expect, test } from "./fixtures";

import { today, weekDays } from "./support/dates";
import {
  createMeeting,
  expectOnDay,
  meeting,
  uniqueName,
} from "./support/meetings";
import { switchView } from "./support/navigation";

test.describe("month view", () => {
  test("shows the current month with today highlighted on first load", async ({
    monthPage: page,
  }) => {
    await expect(page.getByRole("heading", { level: 2 })).toContainText(
      today.month,
    );
    await expect(
      page.getByRole("combobox", { name: "View Picker" }),
    ).toHaveText("Month");
    await expect(
      page.getByRole("gridcell", { name: today.label }),
    ).toHaveAttribute("aria-current", "date");
  });

  test("keeps a meeting on its day when switching between month and week", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Switch");
    const day = weekDays[2];
    await test.step("book a meeting", async () => {
      await createMeeting(page, { name, day });
    });

    await test.step("switch to the week view", async () => {
      await switchView(page, "week");
      await expectOnDay(page, name, day.label);
    });

    await test.step("switch back to the month view", async () => {
      await switchView(page, "month");
      await expectOnDay(page, name, day.label);
    });
  });

  test("navigates between months with Next, Previous and Today", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Here");
    let title = "";

    await test.step("book a meeting and note the month title", async () => {
      await createMeeting(page, { name, day: weekDays[2] });
      title = await page.getByRole("heading", { level: 2 }).innerText();
    });

    await test.step("go to the next month", async () => {
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expect(page).toHaveURL(/\/calendar\/month\/\d{4}-\d{2}-\d{2}/);
      await expect(meeting(page, name)).toBeHidden();
      await expect(page.getByRole("heading", { level: 2 })).not.toHaveText(
        title,
      );
    });

    await test.step("go back two months, one at a time", async () => {
      await page.getByRole("button", { name: "Previous", exact: true }).click();
      await expect(meeting(page, name)).toBeVisible();

      await page.getByRole("button", { name: "Previous", exact: true }).click();
      await expect(meeting(page, name)).toBeHidden();
    });

    await test.step("click Today", async () => {
      await page.getByRole("button", { name: "Today" }).click();
      await expect(meeting(page, name)).toBeVisible();
      await expect(page.getByRole("heading", { level: 2 })).toHaveText(title);
    });
  });
});
