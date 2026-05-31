import { defineConfig, devices } from "@playwright/test";

const frontendPort = Number(process.env.PLAYWRIGHT_REAL_FRONTEND_PORT ?? 3200);
const backendPort = Number(process.env.PLAYWRIGHT_REAL_BACKEND_PORT ?? 3201);
const baseURL = process.env.PLAYWRIGHT_REAL_BASE_URL ?? `http://127.0.0.1:${frontendPort}`;
const apiURL = process.env.NEXT_PUBLIC_API_URL ?? `http://127.0.0.1:${backendPort}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.real.spec.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { outputFolder: "playwright-report-real" }], ["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command: `PORT=${backendPort} FRONTEND_URL=${baseURL} BETTER_AUTH_URL=${apiURL} npm run start`,
      cwd: "../planin-be",
      url: `${apiURL}/api/auth/ok`,
      reuseExistingServer: false,
      timeout: 120 * 1000,
    },
    {
      command: `NEXT_PUBLIC_API_URL=${apiURL} npm run dev -- --hostname 127.0.0.1 --port ${frontendPort}`,
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120 * 1000,
    },
  ],
  projects: [
    {
      name: "chromium-real",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
