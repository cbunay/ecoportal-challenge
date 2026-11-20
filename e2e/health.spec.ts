import { expect, test } from "@playwright/test";
import { testTimeZone } from "../src/lib/defaults";

test("calendar app is healthy", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveURL(/\/calendar\/month$/);
  await expect(page).toHaveTitle("Calendar");

  const sidebar = page.getByRole("navigation", { name: "Sidebar" });
  await expect(sidebar.getByRole("button", { name: "Create" })).toBeVisible();

  const toolbar = page.getByRole("toolbar", { name: "Toolbar" });
  await expect(toolbar.getByRole("button", { name: "Today" })).toBeVisible();
  await expect(toolbar.getByRole("button", { name: "View" })).toHaveText(
    "Month",
  );
  await expect(toolbar.getByRole("button", { name: "Previous" })).toBeVisible();
  await expect(toolbar.getByRole("button", { name: "Next" })).toBeVisible();

  await expect(page.getByRole("main")).toBeVisible();

  const browserTimeZone = await page.evaluate(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  expect(browserTimeZone).toBe(testTimeZone);
});
