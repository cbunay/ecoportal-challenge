import { expect, test } from "./fixtures";

import { crossMonth, otherWeekDays, weekDays } from "./support/dates";
import {
  createMeeting,
  expectOnDay,
  meeting,
  openMeeting,
  seedMeeting,
  uniqueName,
} from "./support/meetings";
import { openAt } from "./support/navigation";

test.describe("week view", () => {
  test("places a 09:00 to 10:30 meeting at 9 AM, 1.5 hours tall", async ({
    weekPage: page,
  }) => {
    const name = uniqueName("Hours");
    const day = weekDays[5];
    await createMeeting(page, { name, day, start: "09:00", end: "10:30" });

    const nineAm = page
      .getByRole("gridcell", { name: new RegExp(`^${day.label}, 9 AM`) })
      .first();
    const slot = await nineAm.boundingBox();
    const box = await meeting(page, name).boundingBox();

    expect(slot).not.toBeNull();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.y - slot!.y)).toBeLessThan(2);
    expect(box!.height / slot!.height).toBeCloseTo(1.5, 1);
  });

  test("shows an overnight meeting on both days it covers", async ({
    weekPage: page,
  }) => {
    const name = uniqueName("Night shift");
    const [friday, saturday] = [weekDays[5], weekDays[6]];
    await seedMeeting(page, {
      name,
      from: { day: friday, time: "22:00" },
      to: { day: saturday, time: "02:00" },
    });

    await expect(meeting(page, name).first()).toBeVisible();
    const boxes = await Promise.all(
      (await meeting(page, name).all()).map((block) => block.boundingBox()),
    );
    const left = Math.min(...boxes.map((box) => box!.x));
    const right = Math.max(...boxes.map((box) => box!.x + box!.width));
    const fridayCell = await page
      .getByRole("gridcell", { name: new RegExp(`^${friday.label}`) })
      .first()
      .boundingBox();
    const saturdayCell = await page
      .getByRole("gridcell", { name: new RegExp(`^${saturday.label}`) })
      .first()
      .boundingBox();

    expect(left).toBeLessThan(fridayCell!.x + fridayCell!.width);
    expect(right).toBeGreaterThan(saturdayCell!.x);
  });

  test("opens and removes overlapping meetings independently", async ({
    page,
  }) => {
    const day = otherWeekDays[4];
    const [first, second] = [uniqueName("Busy 1"), uniqueName("Busy 2")];
    await test.step("book two meetings on the same day", async () => {
      await openAt(page, "week", day);
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

  test("shows meetings on both sides of a month boundary in the same week", async ({
    page,
  }) => {
    test.skip(!crossMonth, "This month has no week that spans two months");
    const { before, after } = crossMonth!;
    const early = uniqueName("Month end");
    const late = uniqueName("Month start");
    await openAt(page, "week", before);

    await expect(page.getByRole("heading", { level: 2 })).toHaveText(
      /^\w{3} \d{4} – \w{3} \d{4}$/,
    );
    await createMeeting(page, {
      name: early,
      day: before,
      start: "09:00",
      end: "10:00",
    });
    await createMeeting(page, {
      name: late,
      day: after,
      start: "09:00",
      end: "10:00",
    });

    await expectOnDay(page, early, before.label);
    await expectOnDay(page, late, after.label);
  });
});
