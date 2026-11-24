import { expect, test } from "./fixtures";

import { firstDay, lastDay, otherWeekDays } from "./support/dates";
import {
  createMeeting,
  expectOnDay,
  meeting,
  openMeeting,
  seedMeeting,
  uniqueName,
} from "./support/meetings";
import { openAt } from "./support/navigation";

test.describe("month view", () => {
  test("stretches a three-day meeting across each of its days and opens it on click", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Offsite");
    const [first, , third] = otherWeekDays;
    await seedMeeting(page, {
      name,
      from: { day: first, time: "09:00" },
      to: { day: third, time: "11:00" },
    });

    const bar = meeting(page, name);
    await expect(bar).toBeVisible();
    const firstCell = await page
      .getByRole("gridcell", { name: first.label })
      .boundingBox();
    const lastCell = await page
      .getByRole("gridcell", { name: third.label })
      .boundingBox();
    const box = await bar.boundingBox();

    expect(box!.x).toBeGreaterThanOrEqual(firstCell!.x - 1);
    expect(box!.x).toBeLessThan(firstCell!.x + firstCell!.width);
    expect(box!.x + box!.width).toBeGreaterThan(lastCell!.x);
    expect(box!.x + box!.width).toBeLessThanOrEqual(
      lastCell!.x + lastCell!.width + 1,
    );

    await openMeeting(page, name);
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  });

  test("opens and removes overlapping meetings independently", async ({
    page,
  }) => {
    const day = otherWeekDays[4];
    const [first, second] = [uniqueName("Busy 1"), uniqueName("Busy 2")];

    await test.step("book two meetings on the same day", async () => {
      await openAt(page, "month", day);
      await createMeeting(page, { name: first, day });
      await createMeeting(page, { name: second, day });
    });

    await test.step("remove the first meeting", async () => {
      await openMeeting(page, first);
      await page.getByRole("button", { name: "Remove event" }).click();

      await expect(page.getByText("Event deleted")).toBeVisible();
      await expect(meeting(page, first)).toBeHidden();
      await expect(meeting(page, second)).toBeVisible();
    });
  });

  test.describe("month edges", () => {
    test("keeps a 22:00 meeting on the last day of the month", async ({
      page,
    }) => {
      const name = uniqueName("Late");

      await test.step("book the meeting", async () => {
        await openAt(page, "month", lastDay);
        await createMeeting(page, {
          name,
          day: lastDay,
          start: "22:00",
          end: "23:00",
        });
        await expectOnDay(page, name, lastDay.label);
      });

      await test.step("reload the page", async () => {
        await page.reload();
        await expectOnDay(page, name, lastDay.label);
      });
    });

    test("keeps a 00:30 meeting on the first day of the month", async ({
      page,
    }) => {
      const name = uniqueName("Early");

      await test.step("book the meeting", async () => {
        await openAt(page, "month", firstDay);
        await createMeeting(page, {
          name,
          day: firstDay,
          start: "00:30",
          end: "01:30",
        });
        await expectOnDay(page, name, firstDay.label);
      });

      await test.step("reload the page", async () => {
        await page.reload();
        await expectOnDay(page, name, firstDay.label);
      });
    });
  });
});
