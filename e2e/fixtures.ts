/* eslint-disable react-hooks/rules-of-hooks -- Playwright's `use` is not a React hook */
import { test as base, type Page } from "@playwright/test";

import { openView } from "./support/navigation";

export const test = base.extend<{ monthPage: Page; weekPage: Page }>({
  monthPage: async ({ page }, use) => {
    await openView(page, "month");
    await use(page);
  },
  weekPage: async ({ page }, use) => {
    await openView(page, "week");
    await use(page);
  },
});

export { expect } from "@playwright/test";
