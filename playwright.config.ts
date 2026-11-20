import { defineConfig, devices } from "@playwright/test";

import { testTimeZone } from "./src/lib/defaults";

const port = process.env.PLAYWRIGHT_PORT ?? "3000";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    trace: "on-first-retry",
    timezoneId: testTimeZone,
  },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `${baseURL}/calendar/month`,
    reuseExistingServer: !process.env.CI,
    env: {
      ...(process.env as Record<string, string>),
      TZ: testTimeZone,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], timezoneId: testTimeZone },
    },
  ],
});
