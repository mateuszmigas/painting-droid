import { expect, test } from "@playwright/test";
import { TestApp } from "../testApp";
import { mouseActionBetweenPoints, mouseActionBetweenRectangleCorners } from "../utils";

test.describe("erase draw", () => {
  test("draw rectangle and erase part of it", async ({ page }) => {
    const app = await TestApp.from(page);
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.selectTool("brush");
    await mouseActionBetweenRectangleCorners(app, {
      x: box.x + 50,
      y: box.y + 50,
      width: box.width - 100,
      height: box.height - 100,
    });
    await app.selectTool("eraser");
    await app.setToolSetting("size", "20");
    await mouseActionBetweenPoints(app, [
      { x: box.x + box.width / 2, y: box.y + 50 },
      { x: box.x + box.width - 50, y: box.y + box.height - 50 },
      { x: box.x + 50, y: box.y + box.height - 50 },
      { x: box.x + box.width / 2, y: box.y + 50 },
    ]);
    const buffer = await app.getLayerCanvasBuffer();
    await expect(buffer).toMatchSnapshot(["tool-eraser.png"], {
      maxDiffPixelRatio: 0.01,
    });
  });
});
