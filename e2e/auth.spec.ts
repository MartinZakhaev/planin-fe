import { expect, type Page, test } from "@playwright/test";

const verifiedUser = {
  id: "user_e2e_verified",
  email: "verified@example.com",
  name: "Verified User",
  image: null,
  emailVerified: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  banned: false,
  banReason: null,
  banExpires: null,
  role: {
    id: "role_admin",
    name: "admin",
    displayName: "Admin",
  },
};

const unverifiedUser = {
  ...verifiedUser,
  id: "user_e2e_unverified",
  email: "unverified@example.com",
  name: "Unverified User",
  emailVerified: false,
};

async function jsonResponse(status: number, body: unknown = {}) {
  return {
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  };
}

async function mockGuestSession(page: Page) {
  await page.route("**/api/auth/get-session", async (route) => {
    await route.fulfill(await jsonResponse(401, { message: "Not authenticated" }));
  });
}

async function mockAuthenticatedSession(page: Page, user = verifiedUser) {
  await page.route("**/api/auth/get-session", async (route) => {
    await route.fulfill(await jsonResponse(200, { user }));
  });

  await page.route("**/users", async (route) => {
    await route.fulfill(await jsonResponse(200, [user]));
  });
}

test.describe("authentication", () => {
  test("registers a new account and opens OTP verification", async ({ page }) => {
    const email = `new-user-${Date.now()}@example.com`;

    await mockGuestSession(page);
    await page.route("**/api/auth/sign-up/email", async (route) => {
      const request = route.request();
      expect(request.method()).toBe("POST");
      expect(await request.postDataJSON()).toMatchObject({
        name: "New User",
        email,
        password: "Password123!",
      });

      await route.fulfill(await jsonResponse(200, { user: { ...unverifiedUser, email } }));
    });
    await page.route("**/api/email-verification/send", async (route) => {
      expect(await route.request().postDataJSON()).toMatchObject({ email });
      await route.fulfill(await jsonResponse(200, { ok: true, status: "sent", expiresInSeconds: 300 }));
    });
    await page.route("**/api/auth/sign-out", async (route) => {
      await route.fulfill(await jsonResponse(200, { ok: true }));
    });

    await page.goto("/signup");
    await page.getByPlaceholder("Full name").fill("New User");
    await page.getByPlaceholder("you@example.com").fill(email);
    await page.getByPlaceholder("Password (min. 8 characters)").fill("Password123!");
    await page.getByPlaceholder("Confirm password").fill("Password123!");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(new RegExp(`/verify-otp\\?email=${encodeURIComponent(email)}`));
    await expect(page.getByRole("heading", { name: /verify your email/i })).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
  });

  test("verifies an OTP code and returns to login", async ({ page }) => {
    const email = "otp-user@example.com";

    await page.route("**/api/email-verification/verify", async (route) => {
      expect(await route.request().postDataJSON()).toEqual({
        email,
        otp: "123456",
      });

      await route.fulfill(await jsonResponse(200, { ok: true, emailVerified: true }));
    });

    await page.goto(`/verify-otp?email=${encodeURIComponent(email)}`);
    await page.getByLabel("OTP digit 1").pressSequentially("123456");
    await page.getByRole("button", { name: /verify account/i }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: /log in to your account/i })).toBeVisible();
  });

  test("resends an OTP code from the verification page", async ({ page }) => {
    const email = "resend-user@example.com";

    await page.route("**/api/email-verification/send", async (route) => {
      expect(await route.request().postDataJSON()).toMatchObject({ email });
      await route.fulfill(await jsonResponse(200, { ok: true, status: "sent", expiresInSeconds: 300 }));
    });

    await page.goto(`/verify-otp?email=${encodeURIComponent(email)}`);
    await page.getByRole("button", { name: /resend code/i }).click();

    await expect(page.getByRole("button", { name: /resend in 60s/i })).toBeVisible();
  });

  test("logs in a verified user and opens the dashboard", async ({ page }) => {
    await mockGuestSession(page);
    await page.route("**/api/auth/sign-in/email", async (route) => {
      expect(await route.request().postDataJSON()).toEqual({
        email: verifiedUser.email,
        password: "Password123!",
      });

      await mockAuthenticatedSession(page);
      await route.fulfill(await jsonResponse(200, { user: verifiedUser }));
    });

    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(verifiedUser.email);
    await page.getByPlaceholder("Password").fill("Password123!");
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("main").getByRole("button", { name: /toggle sidebar/i })).toBeVisible();
  });

  test("redirects an unverified login to OTP verification", async ({ page }) => {
    await mockGuestSession(page);
    await page.route("**/api/auth/sign-in/email", async (route) => {
      await page.unroute("**/api/auth/get-session");
      await mockAuthenticatedSession(page, unverifiedUser);
      await route.fulfill(await jsonResponse(200, { user: unverifiedUser }));
    });
    await page.route("**/api/auth/sign-out", async (route) => {
      await route.fulfill(await jsonResponse(200, { ok: true }));
    });

    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(unverifiedUser.email);
    await page.getByPlaceholder("Password").fill("Password123!");
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(
      new RegExp(`/verify-otp\\?email=${encodeURIComponent(unverifiedUser.email)}`),
    );
    await expect(page.getByRole("heading", { name: /verify your email/i })).toBeVisible();
  });
});
