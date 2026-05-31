import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const adminEmail = "pw_e2e_admin@example.com";
const verifyEmail = "pw_e2e_verify@example.com";
const password = "Password123!";
const suffix = Date.now().toString(36).toUpperCase();
const shortSuffix = suffix.slice(-8);

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
  execFileSync("node", ["test/playwright-seed.cjs"], {
    cwd: resolve(process.cwd(), "../planin-be"),
    env: process.env,
    stdio: "inherit",
  });
});

async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(adminEmail);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function openRowMenu(page: Page, rowText: string) {
  const row = page.getByRole("row").filter({ hasText: rowText }).first();
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: /open menu/i }).click();
}

async function deleteRow(
  page: Page,
  rowText: string,
  confirmLabel: RegExp | string = /^Delete$/,
  endpoint?: string,
) {
  await openRowMenu(page, rowText);
  await page.getByRole("menuitem", { name: /^Delete$/ }).click();
  const deleteResponse = endpoint
    ? page.waitForResponse(
        (response) =>
          response.request().method() === "DELETE" &&
          response.url().includes(endpoint),
      )
    : Promise.resolve(null);
  await page.getByRole("button", { name: confirmLabel }).click();
  const response = await deleteResponse;
  expect(response?.ok() ?? true).toBeTruthy();
  await expect(page.getByRole("row").filter({ hasText: rowText })).toHaveCount(0);
}

test("auth flow uses the real backend and session cookie", async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole("main").getByRole("button", { name: /toggle sidebar/i })).toBeVisible();

  await page.goto("/login");
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("registration and OTP verification hit real auth endpoints", async ({ page }) => {
  const registerEmail = `pw_e2e_register_${suffix.toLowerCase()}@example.com`;

  await page.goto("/signup");
  await page.getByPlaceholder("Full name").fill("Playwright Register");
  await page.getByPlaceholder("you@example.com").fill(registerEmail);
  await page.getByPlaceholder("Password (min. 8 characters)").fill(password);
  await page.getByPlaceholder("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(new RegExp(`/verify-otp\\?email=${encodeURIComponent(registerEmail)}`));
  await expect(page.getByRole("heading", { name: /verify your email/i })).toBeVisible();

  await page.goto(`/verify-otp?email=${encodeURIComponent(verifyEmail)}`);
  await page.getByLabel("OTP digit 1").pressSequentially("123456");
  await page.getByRole("button", { name: /verify account/i }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("units master data performs real create, edit, delete, search, and bulk delete", async ({ page }) => {
  await loginAsAdmin(page);

  const unitCode = `PW_E2E_U_${shortSuffix}`;
  const unitName = `Playwright Unit ${suffix}`;
  const updatedName = `Playwright Unit Updated ${suffix}`;
  const bulkCode = `PW_E2E_B_${shortSuffix}`;
  const bulkName = `Playwright Bulk Unit ${suffix}`;

  await page.goto("/dashboard/units");
  await expect(page.getByText("All Units", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /add unit/i }).click();
  await page.getByLabel("Unit Code").fill(unitCode);
  await page.getByLabel("Unit Name").fill(unitName);
  await page.getByRole("button", { name: "Create" }).click();

  await page.getByPlaceholder("Search units...").fill(unitCode);
  await expect(page.getByRole("row").filter({ hasText: unitCode })).toBeVisible();
  await expect(page.getByRole("row").filter({ hasText: unitName })).toBeVisible();

  await openRowMenu(page, unitName);
  await page.getByRole("menuitem", { name: /^Edit$/ }).click();
  await page.getByLabel("Unit Name").fill(updatedName);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("row").filter({ hasText: updatedName })).toBeVisible();

  await page.getByRole("button", { name: /add unit/i }).click();
  await page.getByLabel("Unit Code").fill(bulkCode);
  await page.getByLabel("Unit Name").fill(bulkName);
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByPlaceholder("Search units...").fill(bulkCode);
  await expect(page.getByRole("row").filter({ hasText: bulkName })).toBeVisible();

  await page.getByRole("row").filter({ hasText: bulkName }).getByRole("checkbox", { name: "Select row" }).click();
  await page.getByRole("button", { name: /delete \(1\)/i }).click();
  await page.getByRole("button", { name: "Delete All" }).click();
  await expect(page.getByRole("row").filter({ hasText: bulkName })).toHaveCount(0);

  await page.getByPlaceholder("Search units...").fill(unitCode);
  await deleteRow(page, updatedName, /^Delete$/, "/units/");
});

test("admin master data pages perform real CRUD through the backend", async ({ page }) => {
  await loginAsAdmin(page);

  const divisionName = `Playwright Division ${suffix}`;
  const divisionUpdated = `Playwright Division Updated ${suffix}`;
  const divisionCode = `PW_E2E_DIV_${suffix}`;
  await page.goto("/dashboard/work-divisions");
  await page.getByRole("button", { name: /add division/i }).click();
  await page.getByLabel("Code").fill(divisionCode);
  await page.getByLabel("Name").fill(divisionName);
  await page.getByLabel("Description").fill("Created by real fullstack e2e");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByPlaceholder("Search divisions...").fill(divisionCode);
  await expect(page.getByRole("row").filter({ hasText: divisionName })).toBeVisible();
  await openRowMenu(page, divisionName);
  await page.getByRole("menuitem", { name: /^Edit$/ }).click();
  await page.getByLabel("Name").fill(divisionUpdated);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("row").filter({ hasText: divisionUpdated })).toBeVisible();

  const taskName = `Playwright Task ${suffix}`;
  const taskCode = `PW_E2E_TASK_${suffix}`;
  await page.goto("/dashboard/task-catalogs");
  await page.getByRole("button", { name: /add task/i }).click();
  await page.getByText("Select Division").click();
  await page.getByRole("option", { name: new RegExp(divisionUpdated) }).click();
  await page.getByLabel("Code").fill(taskCode);
  await page.getByLabel("Name").fill(taskName);
  await page.getByLabel("Description").fill("Created by real fullstack e2e");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByPlaceholder("Search task catalogs...").fill(taskCode);
  await expect(page.getByRole("row").filter({ hasText: taskName })).toBeVisible();

  const itemName = `Playwright Item ${suffix}`;
  const itemCode = `PW_E2E_ITEM_${suffix}`;
  await page.goto("/dashboard/item-catalogs");
  await page.getByRole("button", { name: /add item/i }).click();
  await page.getByLabel("Code").fill(itemCode);
  await page.getByLabel("Name").fill(itemName);
  await page.getByText("Select Unit").click();
  await page.getByRole("option", { name: /Playwright Base Unit/ }).click();
  await page.getByLabel("Price (IDR)").fill("125000");
  await page.getByLabel("Description").fill("Created by real fullstack e2e");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByPlaceholder("Search item catalogs...").fill(itemCode);
  await expect(page.getByRole("row").filter({ hasText: itemName })).toBeVisible();

  const planName = `Playwright Plan ${suffix}`;
  const planCode = `PW_E2E_PLAN_${suffix}`;
  await page.goto("/dashboard/plans");
  await page.getByRole("button", { name: /add plan/i }).click();
  await page.getByLabel("Code").fill(planCode);
  await page.getByLabel("Name").fill(planName);
  await page.getByLabel("Price in cents (IDR)").fill("9900000");
  await page.getByLabel("Max Projects").fill("7");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByPlaceholder("Search plans...").fill(planCode);
  await expect(page.getByRole("row").filter({ hasText: planName })).toBeVisible();

  const orgName = `Playwright Org ${suffix}`;
  const orgCode = `PW_E2E_ORG_${suffix}`;
  await page.goto("/dashboard/organizations");
  await page.getByRole("button", { name: /add organization/i }).click();
  await page.getByLabel("Name").fill(orgName);
  await page.getByLabel("Code").fill(orgCode);
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByPlaceholder("Search organizations...").fill(orgCode);
  await expect(page.getByRole("row").filter({ hasText: orgName })).toBeVisible();

  const roleName = `Playwright Role ${suffix}`;
  const roleIdentifier = `pw_e2e_role_${suffix.toLowerCase()}`;
  await page.goto("/dashboard/roles");
  await page.getByRole("button", { name: /add role/i }).click();
  await page.getByLabel("Name (Identifier)").fill(roleIdentifier);
  await page.getByLabel("Display Name").fill(roleName);
  await page.getByLabel("Description").fill("Created by real fullstack e2e");
  await page.getByRole("checkbox", { name: "read" }).first().click();
  await page.getByRole("button", { name: "Create Role" }).click();
  await page.getByPlaceholder("Search roles...").fill(roleIdentifier);
  await expect(page.getByRole("row").filter({ hasText: roleName })).toBeVisible();

  const createdUser = `Playwright Managed User ${suffix}`;
  const createdUserEmail = `pw_e2e_user_${suffix.toLowerCase()}@example.com`;
  await page.goto("/dashboard/users");
  await page.getByRole("button", { name: /add user/i }).click();
  await page.getByLabel("Full Name").fill(createdUser);
  await page.getByLabel("Email").fill(createdUserEmail);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Administrator", exact: true }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByPlaceholder("Search users...").fill(createdUserEmail);
  await expect(page.getByRole("row").filter({ hasText: createdUser })).toBeVisible();

  await page.goto("/dashboard/audit-logs");
  await expect(page.getByText("System Audit Logs", { exact: true })).toBeVisible();
  await page.getByPlaceholder("Search logs...").fill("CREATE");
  await expect(page.getByRole("row").filter({ hasText: /CREATE/i }).first()).toBeVisible();

  await page.goto("/dashboard/users");
  await page.getByPlaceholder("Search users...").fill(createdUserEmail);
  await deleteRow(page, createdUser, /^Delete$/, "/users/");
  await page.goto("/dashboard/roles");
  await page.getByPlaceholder("Search roles...").fill(roleIdentifier);
  await deleteRow(page, roleName, /^Delete$/, "/roles/");
  await page.goto("/dashboard/organizations");
  await page.getByPlaceholder("Search organizations...").fill(orgCode);
  await deleteRow(page, orgName, /^Delete$/, "/organizations/");
  await page.goto("/dashboard/plans");
  await page.getByPlaceholder("Search plans...").fill(planCode);
  await deleteRow(page, planName, /^Delete$/, "/plans/");
  await page.goto("/dashboard/item-catalogs");
  await page.getByPlaceholder("Search item catalogs...").fill(itemCode);
  await deleteRow(page, itemName, /^Delete$/, "/item-catalogs/");
  await page.goto("/dashboard/task-catalogs");
  await page.getByPlaceholder("Search task catalogs...").fill(taskCode);
  await deleteRow(page, taskName, /^Delete$/, "/task-catalogs/");
  await page.goto("/dashboard/work-divisions");
  await page.getByPlaceholder("Search divisions...").fill(divisionCode);
  await deleteRow(page, divisionUpdated, /^Delete$/, "/work-division-catalogs/");
});
