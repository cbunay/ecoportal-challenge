import { expect, test, type Locator, type Page } from "@playwright/test";
import { type Day } from "./dates";

export function uniqueName(prefix: string) {
  return `${prefix} ${Math.random().toString(36).slice(2, 8)}`;
}

export function field(page: Page, label: string): Locator {
  return page.getByLabel(label).locator("input");
}

export async function fillTimes(page: Page, start: string, end: string) {
  await field(page, "Start time").fill(start);
  await field(page, "End time").fill(end);
}

export async function createMeeting(
  page: Page,
  {
    name,
    day,
    start = "10:00",
    end = "11:00",
  }: {
    name: string;
    day: Day;
    start?: string;
    end?: string;
  },
) {
  await test.step(
    `create meeting "${name}" on ${day.input}`,
    async () => {
      await page.getByRole("button", { name: "Create" }).click();
      await page.getByRole("menuitem", { name: "Meeting" }).click();
      await page.getByLabel("Name").fill(name);
      await field(page, "Start date").fill(day.input);
      await fillTimes(page, start, end);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Event created").last()).toBeVisible();
      await expect(meeting(page, name)).toBeVisible();
    },
    { box: true },
  );
}

export function meeting(page: Page, name: string) {
  return page.getByRole("button", { name });
}

export async function openMeeting(page: Page, name: string) {
  await test.step(
    `open meeting "${name}"`,
    () => meeting(page, name).click({ position: { x: 2, y: 2 } }),
    { box: true },
  );
}

export async function expectOnDay(page: Page, name: string, dayLabel: string) {
  const column = page
    .getByRole("gridcell", { name: new RegExp(`^${dayLabel}`) })
    .first();
  await expect(async () => {
    const day = await column.boundingBox();
    const box = await meeting(page, name).boundingBox();
    expect(day).not.toBeNull();
    expect(box).not.toBeNull();
    const centre = box!.x + box!.width / 2;
    expect(centre).toBeGreaterThan(day!.x);
    expect(centre).toBeLessThan(day!.x + day!.width);
  }).toPass();
}

export async function seedMeeting(
  page: Page,
  {
    name,
    from,
    to,
  }: {
    name: string;
    from: { day: Day; time: string };
    to: { day: Day; time: string };
  },
) {
  const [startDate, endDate] = await page.evaluate(
    ([start, end]) => [
      new Date(start).toISOString(),
      new Date(end).toISOString(),
    ],
    [`${from.day.input}T${from.time}`, `${to.day.input}T${to.time}`],
  );
  const response = await page.request.post("/api/events", {
    data: { name, type: "meeting", startDate, endDate },
  });
  expect(response.status()).toBe(201);
}

export async function clickEmptyDay(page: Page, day: Day) {
  const cell = page.getByRole("gridcell", { name: day.label });
  const box = await cell.boundingBox();
  expect(box).not.toBeNull();
  await cell.click({ position: { x: box!.width / 2, y: box!.height - 6 } });
}

export async function clickEmptyHour(page: Page, day: Day, hour: string) {
  await page
    .getByRole("gridcell", { name: new RegExp(`^${day.label}, ${hour}$`) })
    .click({ position: { x: 4, y: 4 } });
}
