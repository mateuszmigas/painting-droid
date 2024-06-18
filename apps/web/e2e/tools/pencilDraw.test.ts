import { test, expect } from "@playwright/test";
import { TestApp } from "../testApp";
import { mouseActionBetweenPoints } from "../utils";

test.describe("pencil draw", () => {
  test("draws yellow triangle with pencil", async ({ page }) => {
    const app = await TestApp.from(page);
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.selectTool("pencil");
    await app.setToolSetting("color", "#ffff00");
    await mouseActionBetweenPoints(app, [
      { x: box.x + box.width / 2, y: box.y + 50 },
      { x: box.x + box.width - 50, y: box.y + box.height - 50 },
      { x: box.x + 50, y: box.y + box.height - 50 },
      { x: box.x + box.width / 2, y: box.y + 50 },
    ]);
    const buffer = await app.getLayerCanvasBuffer();
    await expect(buffer).toMatchSnapshot(["tool-pencil.png"], {
      maxDiffPixelRatio: 0.01,
    });
  });
});
