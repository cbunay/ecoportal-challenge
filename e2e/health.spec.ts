import { expect, test } from "@playwright/test";

test("calendar app is healthy", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveURL(/\/calendar$/);
  await expect(page).toHaveTitle("Calendar");

  const sidebar = page.getByRole("navigation", { name: "Sidebar" });
  await expect(sidebar.getByRole("button", { name: "Create" })).toBeVisible();

  const toolbar = page.getByRole("toolbar", { name: "Toolbar" });
  await expect(toolbar.getByRole("button", { name: "Today" })).toBeVisible();
  await expect(toolbar.getByRole("combobox", { name: "View" })).toBeVisible();
  await expect(toolbar.getByRole("button", { name: "Previous" })).toBeVisible();
  await expect(toolbar.getByRole("button", { name: "Next" })).toBeVisible();

  await expect(page.getByRole("main")).toBeVisible();
});
