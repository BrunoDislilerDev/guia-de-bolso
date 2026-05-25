// @ts-check
import { test, expect } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("smoke", () => {
  test("health endpoint", async ({ request }) => {
    const res = await request.get(`${baseURL}/api/health`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("home loads", async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.locator("body")).toBeVisible();
  });
});
