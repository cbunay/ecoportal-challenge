import { expect, test } from "./fixtures";

import { weekDays } from "./support/dates";
import {
  createMeeting,
  expectOnDay,
  field,
  meeting,
  openMeeting,
  uniqueName,
} from "./support/meetings";

test.describe("month view", () => {
  test("moves a meeting to the new day when its date is edited", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Move");
    const from = weekDays[3];
    const to = weekDays[6];
    await test.step(`book a meeting on ${from.input}`, async () => {
      await createMeeting(page, { name, day: from });
      await expectOnDay(page, name, from.label);
    });

    await test.step(`move it to ${to.input}`, async () => {
      await openMeeting(page, name);
      await page.getByRole("button", { name: "Edit event" }).click();
      await field(page, "Start date").fill(to.input);
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Event updated")).toBeVisible();
      await expectOnDay(page, name, to.label);
    });
  });

  test("renames a meeting but refuses an empty title", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Old");
    const renamed = uniqueName("New");
    await test.step("book a meeting", async () => {
      await createMeeting(page, { name, day: weekDays[4] });
    });

    await test.step("rename the meeting", async () => {
      await openMeeting(page, name);
      await page.getByRole("button", { name: "Edit event" }).click();
      await page.getByLabel("Name").fill(renamed);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Event updated")).toBeVisible();
      await expect(meeting(page, renamed)).toBeVisible();
      await expect(meeting(page, name)).toHaveCount(0);
    });

    await test.step("clear the title and save", async () => {
      await openMeeting(page, renamed);
      await page.getByRole("button", { name: "Edit event" }).click();
      await page.getByLabel("Name").fill("");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Name is required")).toBeVisible();

      await page.getByRole("button", { name: "Close" }).click();
      await expect(meeting(page, renamed)).toBeVisible();
    });
  });
});
