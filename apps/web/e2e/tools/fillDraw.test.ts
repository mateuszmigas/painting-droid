import { expect, test } from "@playwright/test";
import { TestApp } from "../testApp";
import { mouseActionBetweenPoints } from "../utils";

test.describe("fill draw", () => {
  test("fills triangle", async ({ page }) => {
    const app = await TestApp.from(page);
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.selectTool("pencil");
    await app.setToolSetting("color", "#000000");
    await mouseActionBetweenPoints(app, [
      { x: box.x + box.width / 2, y: box.y + 50 },
      { x: box.x + box.width - 50, y: box.y + box.height - 50 },
      { x: box.x + 50, y: box.y + box.height - 50 },
      { x: box.x + box.width / 2, y: box.y + 50 },
    ]);
    await app.selectTool("fill");
    await app.setToolSetting("color", "#ffffff");
    await app.moveMouse(box.x + box.width / 2, box.y + box.height / 2);
    await app.mouseDown();
    const buffer = await app.getLayerCanvasBuffer();
    await expect(buffer).toMatchSnapshot(["tool-fill.png"], {
      maxDiffPixelRatio: 0.01,
    });
  });
});
