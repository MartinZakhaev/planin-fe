import { expect, test } from "@playwright/test";

test("shows the landing page", async ({ page }) => {
  await page.goto("/");

  const main = page.getByRole("main");

  await expect(
    main.getByRole("heading", { name: /build with precision/i }),
  ).toBeVisible();
  await expect(main.getByRole("link", { name: /start free trial/i })).toBeVisible();
});

test("shows the login form", async ({ page }) => {
  await page.goto("/login");

  await expect(
    page.getByRole("heading", { name: /log in to your account/i }),
  ).toBeVisible();
  await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
});
