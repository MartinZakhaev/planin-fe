import { expect, type Page, type Route, test } from "@playwright/test";

const now = "2026-05-30T00:00:00.000Z";

const adminUser = {
  id: "user_admin",
  email: "admin@example.com",
  fullName: "Admin User",
  name: "Admin User",
  image: null,
  emailVerified: true,
  createdAt: now,
  updatedAt: now,
  banned: false,
  banReason: null,
  banExpires: null,
  roleId: "role_admin",
  role: { id: "role_admin", name: "admin", displayName: "Admin" },
};

type EndpointKey =
  | "/users"
  | "/roles"
  | "/organizations"
  | "/plans"
  | "/subscriptions"
  | "/units"
  | "/work-division-catalogs"
  | "/task-catalogs"
  | "/item-catalogs"
  | "/audit-logs"
  | "/permissions";

function withTimestamps<T extends Record<string, unknown>>(item: T) {
  return { createdAt: now, updatedAt: now, ...item };
}

function requestJson(request: { postDataJSON: () => unknown }) {
  try {
    return request.postDataJSON() as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function fulfillJson(route: Route, status: number, body: unknown = {}) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function mockMasterDataApi(page: Page) {
  const data: Record<EndpointKey, Array<Record<string, unknown>>> = {
    "/users": [
      adminUser,
      withTimestamps({
        id: "user_ops",
        email: "ops@example.com",
        fullName: "Ops User",
        emailVerified: true,
        roleId: "role_user",
        role: { id: "role_user", name: "user", displayName: "User" },
      }),
    ],
    "/roles": [
      withTimestamps({
        id: "role_admin",
        name: "admin",
        displayName: "Admin",
        description: "System administrator",
        isSystem: true,
        permissions: [{ id: "perm_users_read", resource: "users", action: "read" }],
        userCount: 1,
      }),
      withTimestamps({
        id: "role_user",
        name: "user",
        displayName: "User",
        description: "Default user",
        isSystem: false,
        permissions: [],
        userCount: 1,
      }),
    ],
    "/organizations": [
      withTimestamps({ id: "org_alpha", name: "Alpha Build", code: "ALPHA", ownerUserId: adminUser.id }),
    ],
    "/plans": [
      withTimestamps({
        id: "plan_basic",
        code: "BASIC",
        name: "Basic",
        priceCents: 10000000,
        currency: "IDR",
        interval: "monthly",
        maxProjects: 5,
      }),
    ],
    "/subscriptions": [
      withTimestamps({
        id: "sub_basic",
        userId: "user_ops",
        planId: "plan_basic",
        status: "ACTIVE",
        currentPeriodStart: "2026-05-01T00:00:00.000Z",
        currentPeriodEnd: "2026-06-01T00:00:00.000Z",
        trialEndsAt: null,
        canceledAt: null,
      }),
    ],
    "/units": [
      withTimestamps({ id: "unit_m2", code: "m2", name: "Square Meter" }),
      withTimestamps({ id: "unit_kg", code: "kg", name: "Kilogram" }),
    ],
    "/work-division-catalogs": [
      withTimestamps({
        id: "division_structure",
        code: "DIV-001",
        name: "Structure Works",
        description: "Structural construction work",
      }),
    ],
    "/task-catalogs": [
      withTimestamps({
        id: "task_excavation",
        code: "TASK-001",
        name: "Excavation",
        description: "Earthworks",
        divisionId: "division_structure",
      }),
    ],
    "/item-catalogs": [
      withTimestamps({
        id: "item_cement",
        code: "ITM-001",
        name: "Portland Cement",
        type: "MATERIAL",
        unitId: "unit_kg",
        defaultPrice: 78000,
        description: "Bagged cement",
      }),
    ],
    "/audit-logs": [
      {
        id: "audit_create_unit",
        userId: adminUser.id,
        projectId: null,
        action: "CREATE_UNIT",
        entityTable: "units",
        entityId: "unit_m2",
        meta: { code: "m2", name: "Square Meter" },
        ip: "127.0.0.1",
        userAgent: "Playwright",
        createdAt: now,
        user: { id: adminUser.id, fullName: adminUser.fullName, email: adminUser.email },
      },
    ],
    "/permissions": [
      { id: "perm_users_read", resource: "users", action: "read", description: "Read users" },
      { id: "perm_users_create", resource: "users", action: "create", description: "Create users" },
      { id: "perm_projects_read", resource: "projects", action: "read", description: "Read projects" },
    ],
  };

  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (path === "/api/auth/get-session") {
      await fulfillJson(route, 200, { user: adminUser });
      return;
    }

    if (path === "/api/auth/sign-out") {
      await fulfillJson(route, 200, { ok: true });
      return;
    }

    const endpoint = (Object.keys(data) as EndpointKey[])
      .sort((a, b) => b.length - a.length)
      .find((key) => path === key || path.startsWith(`${key}/`));

    if (!endpoint) {
      await route.continue();
      return;
    }

    const id = path === endpoint ? null : decodeURIComponent(path.slice(endpoint.length + 1));
    const collection = data[endpoint];
    const method = request.method();

    if (method === "GET") {
      await fulfillJson(route, 200, id ? collection.find((item) => item.id === id) ?? null : collection);
      return;
    }

    if (method === "POST") {
      const body = requestJson(request);
      const created = withTimestamps({
        id: `${endpoint.slice(1).replace(/[^a-z]/g, "_")}_${collection.length + 1}`,
        ...body,
      });
      collection.push(created);
      await fulfillJson(route, 200, created);
      return;
    }

    if (method === "PATCH" && id) {
      const body = requestJson(request);
      const index = collection.findIndex((item) => item.id === id);
      const updated = withTimestamps({ ...(collection[index] ?? { id }), ...body, id });
      if (index >= 0) {
        collection[index] = updated;
      }
      await fulfillJson(route, 200, updated);
      return;
    }

    if (method === "DELETE" && id) {
      const index = collection.findIndex((item) => item.id === id);
      if (index >= 0) {
        collection.splice(index, 1);
      }
      await fulfillJson(route, 200, { ok: true });
      return;
    }

    await fulfillJson(route, 405, { message: "Method not allowed" });
  });
}

async function openRowMenu(page: Page, rowText: string) {
  const row = page.getByRole("row").filter({ hasText: rowText }).first();
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: /open menu/i }).click();
}

async function selectFirstRadixOption(page: Page, triggerText: RegExp | string, optionText: RegExp | string) {
  await page.getByText(triggerText).click();
  await page.getByRole("option", { name: optionText }).click();
}

async function deleteRow(page: Page, rowText: string, confirmLabel = /^Delete$/) {
  await openRowMenu(page, rowText);
  await page.getByRole("menuitem", { name: /^Delete$/ }).click();
  await page.getByRole("button", { name: confirmLabel }).click();
  await expect(page.getByRole("row").filter({ hasText: rowText })).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await mockMasterDataApi(page);
});

test.describe("dashboard master data", () => {
  test("manages units including search, columns, create, edit, delete, and bulk delete", async ({ page }) => {
    await page.goto("/dashboard/units");
    await expect(page.getByText("All Units", { exact: true })).toBeVisible();

    await page.getByPlaceholder("Search units...").fill("Kilogram");
    await expect(page.getByRole("row").filter({ hasText: "Kilogram" })).toBeVisible();
    await page.getByPlaceholder("Search units...").clear();

    await page.getByRole("button", { name: /columns/i }).click();
    await page.getByRole("menuitemcheckbox", { name: /createdAt/i }).click();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: /add unit/i }).click();
    await page.getByLabel("Unit Code").fill("ltr");
    await page.getByLabel("Unit Name").fill("Liter");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Liter" })).toBeVisible();

    await openRowMenu(page, "Liter");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByLabel("Unit Name").fill("Liter Updated");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Liter Updated" })).toBeVisible();

    await deleteRow(page, "Liter Updated");

    await page.getByRole("row").filter({ hasText: "Square Meter" }).getByRole("checkbox", { name: "Select row" }).click();
    await page.getByRole("button", { name: /delete \(1\)/i }).click();
    await page.getByRole("button", { name: "Delete All" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Square Meter" })).toHaveCount(0);
  });

  test("manages work divisions", async ({ page }) => {
    await page.goto("/dashboard/work-divisions");
    await expect(page.getByText("Work Divisions", { exact: true }).first()).toBeVisible();
    await page.getByPlaceholder("Search divisions...").fill("Structure");
    await expect(page.getByRole("row").filter({ hasText: "Structure Works" })).toBeVisible();
    await page.getByPlaceholder("Search divisions...").clear();

    await page.getByRole("button", { name: /add division/i }).click();
    await page.getByLabel("Code").fill("DIV-002");
    await page.getByLabel("Name").fill("Architectural Works");
    await page.getByLabel("Description").fill("Finishing and architectural work");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Architectural Works" })).toBeVisible();

    await openRowMenu(page, "Architectural Works");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByLabel("Name").fill("Architecture Works");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Architecture Works" })).toBeVisible();

    await deleteRow(page, "Architecture Works");
  });

  test("manages task catalogs with work division selection", async ({ page }) => {
    await page.goto("/dashboard/task-catalogs");
    await expect(page.getByText("Task Catalogs", { exact: true }).first()).toBeVisible();
    await page.getByPlaceholder("Search task catalogs...").fill("Excavation");
    await expect(page.getByRole("row").filter({ hasText: "Excavation" })).toBeVisible();
    await page.getByPlaceholder("Search task catalogs...").clear();

    await page.getByRole("button", { name: /add task/i }).click();
    await selectFirstRadixOption(page, "Select Division", /Structure Works/);
    await page.getByLabel("Code").fill("TASK-002");
    await page.getByLabel("Name").fill("Rebar Installation");
    await page.getByLabel("Description").fill("Install reinforcement steel");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Rebar Installation" })).toBeVisible();

    await openRowMenu(page, "Rebar Installation");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByLabel("Name").fill("Rebar Works");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Rebar Works" })).toBeVisible();

    await deleteRow(page, "Rebar Works");
  });

  test("manages item catalogs with type and unit selection", async ({ page }) => {
    await page.goto("/dashboard/item-catalogs");
    await expect(page.getByText("Item Catalogs", { exact: true }).first()).toBeVisible();
    await page.getByPlaceholder("Search item catalogs...").fill("Cement");
    await expect(page.getByRole("row").filter({ hasText: "Portland Cement" })).toBeVisible();
    await page.getByPlaceholder("Search item catalogs...").clear();

    await page.getByRole("button", { name: /add item/i }).click();
    await page.getByLabel("Code").fill("ITM-002");
    await page.getByLabel("Name").fill("River Sand");
    await page.getByText("Select Unit").click();
    await page.getByRole("option", { name: /Kilogram/ }).click();
    await page.getByLabel("Price (IDR)").fill("125000");
    await page.getByLabel("Description").fill("Washed construction sand");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "River Sand" })).toBeVisible();

    await openRowMenu(page, "River Sand");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByLabel("Name").fill("Fine River Sand");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Fine River Sand" })).toBeVisible();

    await deleteRow(page, "Fine River Sand");
  });

  test("manages users with role selection", async ({ page }) => {
    await page.goto("/dashboard/users");
    await expect(page.getByText("All Users", { exact: true })).toBeVisible();
    await page.getByPlaceholder("Search users...").fill("Ops");
    await expect(page.getByRole("row").filter({ hasText: "Ops User" })).toBeVisible();
    await page.getByPlaceholder("Search users...").clear();

    await page.getByRole("button", { name: /add user/i }).click();
    await page.getByLabel("Full Name").fill("Finance User");
    await page.getByLabel("Email").fill("finance@example.com");
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "User" }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Finance User" })).toBeVisible();

    await openRowMenu(page, "Finance User");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByLabel("Full Name").fill("Finance Lead");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Finance Lead" })).toBeVisible();

    await deleteRow(page, "Finance Lead");
  });

  test("manages roles and permissions", async ({ page }) => {
    await page.goto("/dashboard/roles");
    await expect(page.getByText("All Roles", { exact: true })).toBeVisible();
    await page.getByPlaceholder("Search roles...").fill("User");
    await expect(page.getByRole("row").filter({ hasText: "Default user" })).toBeVisible();
    await page.getByPlaceholder("Search roles...").clear();

    await page.getByRole("button", { name: /add role/i }).click();
    await page.getByLabel("Name (Identifier)").fill("estimator");
    await page.getByLabel("Display Name").fill("Estimator");
    await page.getByLabel("Description").fill("Can estimate project costs");
    await page.getByRole("checkbox", { name: "create" }).click();
    await expect(page.getByText("Selected: 1 permissions")).toBeVisible();
    await page.getByRole("button", { name: "Create Role" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Estimator" })).toBeVisible();

    await openRowMenu(page, "Estimator");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByLabel("Display Name").fill("Cost Estimator");
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Cost Estimator" })).toBeVisible();

    await deleteRow(page, "Cost Estimator");
  });

  test("manages organizations", async ({ page }) => {
    await page.goto("/dashboard/organizations");
    await expect(page.getByText("All Organizations", { exact: true })).toBeVisible();
    await page.getByPlaceholder("Search organizations...").fill("Alpha");
    await expect(page.getByRole("row").filter({ hasText: "Alpha Build" })).toBeVisible();
    await page.getByPlaceholder("Search organizations...").clear();

    await page.getByRole("button", { name: /add organization/i }).click();
    await page.getByLabel("Name").fill("Beta Construct");
    await page.getByLabel("Code").fill("BETA");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Beta Construct" })).toBeVisible();

    await openRowMenu(page, "Beta Construct");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByLabel("Name").fill("Beta Construction");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Beta Construction" })).toBeVisible();

    await deleteRow(page, "Beta Construction");
  });

  test("manages plans", async ({ page }) => {
    await page.goto("/dashboard/plans");
    await expect(page.getByText("All Plans", { exact: true })).toBeVisible();
    await page.getByPlaceholder("Search plans...").fill("Basic");
    await expect(page.getByRole("row").filter({ hasText: "Basic" })).toBeVisible();
    await page.getByPlaceholder("Search plans...").clear();

    await page.getByRole("button", { name: /add plan/i }).click();
    await page.getByLabel("Code").fill("PRO");
    await page.getByLabel("Name").fill("Professional");
    await page.getByLabel("Price in cents (IDR)").fill("25000000");
    await page.getByLabel("Interval").selectOption("yearly");
    await page.getByLabel("Max Projects").fill("25");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Professional" })).toBeVisible();

    await openRowMenu(page, "Professional");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByLabel("Name").fill("Professional Plus");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "Professional Plus" })).toBeVisible();

    await deleteRow(page, "Professional Plus");
  });

  test("manages subscriptions with user, plan, and status selection", async ({ page }) => {
    await page.goto("/dashboard/subscriptions");
    await expect(page.getByText("All Subscriptions", { exact: true })).toBeVisible();
    await page.getByPlaceholder("Search subscriptions...").fill("ACTIVE");
    await expect(page.getByRole("row").filter({ hasText: "ACTIVE" })).toBeVisible();
    await page.getByPlaceholder("Search subscriptions...").clear();

    await page.getByRole("button", { name: /add subscription/i }).click();
    await page.getByText("Select User").click();
    await page.getByRole("option", { name: /Ops User/ }).click();
    await page.getByText("Select Plan").click();
    await page.getByRole("option", { name: /Basic/ }).click();
    await page.getByLabel("Period Start").fill("2026-05-01");
    await page.getByLabel("Period End").fill("2026-06-01");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "user_ops" }).first()).toBeVisible();

    await openRowMenu(page, "user_ops");
    await page.getByRole("menuitem", { name: /^Edit$/ }).click();
    await page.getByRole("combobox").filter({ hasText: "Active" }).click();
    await page.getByRole("option", { name: "Expired" }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row").filter({ hasText: "EXPIRED" })).toBeVisible();

    await openRowMenu(page, "EXPIRED");
    await page.getByRole("menuitem", { name: /^Delete$/ }).click();
    await page.getByRole("button", { name: "Cancel Subscription" }).click();
  });

  test("views audit logs, details, search, sort, and columns", async ({ page }) => {
    await page.goto("/dashboard/audit-logs");
    await expect(page.getByText("System Audit Logs", { exact: true })).toBeVisible();
    await page.getByPlaceholder("Search logs...").fill("CREATE_UNIT");
    await expect(page.getByRole("row").filter({ hasText: "CREATE_UNIT" })).toBeVisible();
    await page.getByRole("button", { name: /timestamp/i }).click();
    await page.getByRole("button", { name: /columns/i }).click();
    await page.getByRole("menuitemcheckbox", { name: /ip/i }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /view/i }).click();
    await expect(page.getByRole("heading", { name: "Audit Log Details" })).toBeVisible();
    await expect(page.getByText('"code": "m2"')).toBeVisible();
  });
});
