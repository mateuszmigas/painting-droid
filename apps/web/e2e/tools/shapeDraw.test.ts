import { expect, test } from "@playwright/test";
import { TestApp } from "../testApp";
import { mouseActionBetweenPoints } from "../utils";

test.describe("shape draw", () => {
  test.skip(({ browserName }) => browserName === "webkit", "This test is disabled for WebKit");

  test("draws ellipse shape", async ({ page }) => {
    const app = await TestApp.from(page);
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.selectTool("shape");
    await app.setToolSetting("type", "Ellipse");
    await app.setToolSetting("fillColor", "#0000ff");
    await app.setToolSetting("strokeColor", "#ff0000");
    await app.setToolSetting("strokeWidth", "5px");
    await mouseActionBetweenPoints(app, [
      { x: box.x + 50, y: box.y + 75 },
      { x: box.x + box.width - 50, y: box.y + box.height - 75 },
    ]);
    await app.applySelectedShape();
    const buffer = await app.getLayerCanvasBuffer();
    await expect(buffer).toMatchSnapshot(["tool-shape-ellipse.png"], {
      maxDiffPixelRatio: 0.01,
    });
  });

  test("draws rectangle shape", async ({ page }) => {
    const app = await TestApp.from(page);
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.selectTool("shape");
    await app.setToolSetting("type", "Rectangle");
    await app.setToolSetting("fillColor", "#00ffff");
    await app.setToolSetting("strokeColor", "#fff000");
    await app.setToolSetting("strokeWidth", "5px");
    await mouseActionBetweenPoints(app, [
      { x: box.x + 50, y: box.y + 75 },
      { x: box.x + box.width - 50, y: box.y + box.height - 75 },
    ]);
    await app.applySelectedShape();
    const buffer = await app.getLayerCanvasBuffer();
    await expect(buffer).toMatchSnapshot(["tool-shape-rectangle.png"], {
      maxDiffPixelRatio: 0.01,
    });
  });
});
