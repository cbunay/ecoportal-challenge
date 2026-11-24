import { expect, test } from "./fixtures";

import { weekDays } from "./support/dates";
import {
  clickEmptyDay,
  clickEmptyHour,
  createMeeting,
  expectOnDay,
  field,
  fillTimes,
  meeting,
  uniqueName,
} from "./support/meetings";

test.describe("month view", () => {
  test("books a meeting from the Create menu and keeps it after a reload", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Book");
    const day = weekDays[0];

    await test.step("book the meeting from the Create menu", async () => {
      await createMeeting(page, { name, day });
      await expectOnDay(page, name, day.label);
    });

    await test.step("reload the page", async () => {
      await page.reload();
      await expectOnDay(page, name, day.label);
    });
  });

  test("books a meeting by clicking an empty day", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Click");
    const day = weekDays[5];

    await test.step("click an empty day", async () => {
      await clickEmptyDay(page, day);
      await expect(field(page, "Start date")).toHaveValue(day.input);
    });

    await test.step("name the meeting, set 14:00 to 15:00 and save", async () => {
      await page.getByLabel("Name").fill(name);
      await fillTimes(page, "14:00", "15:00");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Event created")).toBeVisible();
      await expectOnDay(page, name, day.label);
    });
  });

  test("rejects a missing name and a bad time range until the form is fixed", async ({
    monthPage: page,
  }) => {
    const name = uniqueName("Fix");
    const day = weekDays[1];
    await test.step("open the form and save it empty", async () => {
      await page.getByRole("button", { name: "Create" }).click();
      await page.getByRole("menuitem", { name: "Meeting" }).click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Name is required")).toBeVisible();
    });

    await test.step("enter an end time before the start", async () => {
      await page.getByLabel("Name").fill(name);
      await field(page, "Start date").fill(day.input);
      await fillTimes(page, "11:00", "10:00");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("End must be after start")).toBeVisible();
    });

    await test.step("correct the times and save", async () => {
      await fillTimes(page, "10:00", "11:00");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Event created")).toBeVisible();
      await expectOnDay(page, name, day.label);
    });
  });
});

test.describe("week view", () => {
  test("books a meeting from the Create menu and keeps it after a reload", async ({
    weekPage: page,
  }) => {
    const name = uniqueName("Book");
    const day = weekDays[0];

    await test.step("book the meeting from the Create menu", async () => {
      await createMeeting(page, { name, day });
      await expectOnDay(page, name, day.label);
    });

    await test.step("reload the page", async () => {
      await page.reload();
      await expectOnDay(page, name, day.label);
    });
  });

  test("books a meeting by clicking an empty hour", async ({
    weekPage: page,
  }) => {
    const name = uniqueName("Click");
    const day = weekDays[5];

    await test.step("click the 2 PM slot", async () => {
      await clickEmptyHour(page, day, "2 PM");
      await expect(field(page, "Start date")).toHaveValue(day.input);
      await expect(field(page, "Start time")).toHaveValue("14:00");
      await expect(field(page, "End time")).toHaveValue("15:00");
    });

    await test.step("name the meeting and save", async () => {
      await page.getByLabel("Name").fill(name);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Event created")).toBeVisible();
      await expectOnDay(page, name, day.label);
    });
  });

  test("rejects a missing name and a bad time range until the form is fixed", async ({
    weekPage: page,
  }) => {
    const name = uniqueName("Fix");
    const day = weekDays[1];
    await test.step("open the form and save it empty", async () => {
      await page.getByRole("button", { name: "Create" }).click();
      await page.getByRole("menuitem", { name: "Meeting" }).click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Name is required")).toBeVisible();
    });

    await test.step("enter an end time before the start", async () => {
      await page.getByLabel("Name").fill(name);
      await field(page, "Start date").fill(day.input);
      await fillTimes(page, "11:00", "10:00");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("End must be after start")).toBeVisible();
    });

    await test.step("correct the times and save", async () => {
      await fillTimes(page, "10:00", "11:00");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Event created")).toBeVisible();
      await expectOnDay(page, name, day.label);
    });
  });

  test("discards the draft when the form is closed", async ({
    weekPage: page,
  }) => {
    const name = uniqueName("Abandon");
    await test.step("open the form and type a name", async () => {
      await page.getByRole("button", { name: "Create" }).click();
      await page.getByRole("menuitem", { name: "Meeting" }).click();
      await page.getByLabel("Name").fill(name);
    });

    await test.step("close the form", async () => {
      await page.getByRole("button", { name: "Close" }).click();
      await expect(page.getByRole("dialog")).toBeHidden();
      await expect(meeting(page, name)).toHaveCount(0);
    });

    await test.step("reopen the form", async () => {
      await page.getByRole("button", { name: "Create" }).click();
      await page.getByRole("menuitem", { name: "Meeting" }).click();
      await expect(page.getByLabel("Name")).toHaveValue("");
    });
  });
});
