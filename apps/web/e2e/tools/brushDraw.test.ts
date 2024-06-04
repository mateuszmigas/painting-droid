import { test, expect } from "@playwright/test";
import { TestApp } from "../testApp";
import { mouseActionBetweenRectangleCorners } from "../utils";

test.describe("brush draw", () => {
  test("draws blue rectangle with brush", async ({ page }) => {
    const app = await TestApp.from(page);
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.selectTool("brush");
    await app.setToolSetting("color", "#0000ff");
    await app.setToolSetting("size", "10");
    await mouseActionBetweenRectangleCorners(app, {
      x: box.x + 50,
      y: box.y + 50,
      width: box.width - 100,
      height: box.height - 100,
    });
    const buffer = await app.getLayerCanvasBuffer();
    await expect(buffer).toMatchSnapshot(["tool-brush.png"]);
  });
});
