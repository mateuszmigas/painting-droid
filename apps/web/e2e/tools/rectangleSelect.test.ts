import { test, expect } from "@playwright/test";
import { TestApp } from "../testApp";
import {
  mouseActionBetweenPoints,
  mouseActionBetweenRectangleCorners,
} from "../utils";

test.describe("rectangle select", () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'This test is disabled for WebKit');
  
  test("copies dragged image", async ({ page }) => {
    const app = await TestApp.from(page);
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.selectTool("brush");
    await mouseActionBetweenRectangleCorners(app, {
      x: box.x + 50,
      y: box.y + 50,
      width: box.width - 100,
      height: box.height - 100,
    });
    await app.selectTool("rectangleSelect");
    await mouseActionBetweenPoints(app, [
      { x: box.x, y: box.y },
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    ]);
    await mouseActionBetweenPoints(app, [
      { x: box.x + box.width / 4, y: box.y + box.height / 4 },
      { x: box.x + (box.width * 3) / 4, y: box.y + (box.height * 3) / 4 },
    ]);
    await app.pressKey("Enter");
    await app.waitForCanvasApply();
    const buffer = await app.getLayerCanvasBuffer(0);
    await expect(buffer).toMatchSnapshot(["tool-rectangle-select.png"]);
  });
});

