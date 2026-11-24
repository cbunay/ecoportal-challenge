import { expect, test } from "@playwright/test";
import { testTimeZone } from "../src/lib/defaults";

test("calendar app is healthy", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveURL(/\/calendar\/month$/);
  await expect(page).toHaveTitle("Calendar");
  await expect(page.getByRole("navigation", { name: "Sidebar" })).toBeVisible();
  await expect(page.getByRole("toolbar", { name: "Toolbar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Today" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Previous" })).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "View Picker" }),
  ).toBeVisible();

  expect(
    await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone),
  ).toBe(testTimeZone);
});
