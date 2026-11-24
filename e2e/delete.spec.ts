import { expect, test } from "./fixtures";

import { weekDays } from "./support/dates";
import {
  createMeeting,
  meeting,
  openMeeting,
  uniqueName,
} from "./support/meetings";

test.describe("month view", () => {
  test("removes a meeting and keeps it gone after a reload", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Cancel");
    await test.step("book a meeting", async () => {
      await createMeeting(page, { name, day: weekDays[4] });
    });

    await test.step("remove the meeting", async () => {
      await openMeeting(page, name);
      await page.getByRole("button", { name: "Remove event" }).click();

      await expect(page.getByText("Event deleted")).toBeVisible();
      await expect(meeting(page, name)).toBeHidden();
    });

    await test.step("reload the page", async () => {
      await page.reload();
      await expect(meeting(page, name)).toBeHidden();
    });
  });

  test("keeps the meeting and shows an error when removing fails", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Stuck");
    await test.step("book a meeting", async () => {
      await createMeeting(page, { name, day: weekDays[3] });
    });

    await test.step("remove it while the server answers 500", async () => {
      await page.route("**/api/events/*", (route) =>
        route.request().method() === "DELETE"
          ? route.fulfill({ status: 500, json: { errors: ["Server error"] } })
          : route.fallback(),
      );
      await openMeeting(page, name);
      await page.getByRole("button", { name: "Remove event" }).click();

      await expect(page.getByText("Could not delete the event")).toBeVisible();
    });

    await test.step("close the dialog", async () => {
      await page.getByRole("button", { name: "Close" }).click();
      await expect(meeting(page, name)).toBeVisible();
    });
  });
});
