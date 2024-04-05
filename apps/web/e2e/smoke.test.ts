import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("App has proper title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Painting Droid (Alpha)");
  });
});

