import { expect, type Page } from "@playwright/test";

import { type Day } from "./dates";

export const views = ["month", "week"] as const;
export type View = (typeof views)[number];

export async function openView(page: Page, view: View) {
  await page.goto(`/calendar/${view}`);
  await expect(page.getByRole("button", { name: "Today" })).toBeVisible();
}

export async function openAt(page: Page, view: View, day: Day) {
  await page.goto(`/calendar/${view}/${day.input}`);
  await expect(page.getByRole("button", { name: "Today" })).toBeVisible();
}

export async function switchView(page: Page, view: View) {
  await page.getByRole("combobox", { name: "View Picker" }).click();
  await page
    .getByRole("option", { name: view === "month" ? "Month" : "Week" })
    .click();
  await expect(page).toHaveURL(new RegExp(`/calendar/${view}`));
}
