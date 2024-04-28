import { test, expect } from "@playwright/test";
import { PaintingDroidApp } from "./app";

test.describe("Tools", () => {
  test("Draws rectangle with brush", async ({ page }) => {
    const app = await PaintingDroidApp.from(page);
    await app.selectTool("brush");
    const box = await app.getLayerCanvasBoundingBox(0);
    await app.moveMouse(box.x + 50, box.y + 50);
    await app.mouseDown();
    await app.moveMouse(box.x + box.width - 50, box.y + 50);
    await app.moveMouse(box.x + box.width - 50, box.y + box.height - 50);
    await app.moveMouse(box.x + 50, box.y + box.height - 50);
    await app.moveMouse(box.x + 50, box.y + 50);
    await app.mouseUp();
    const buffer = await app.getLayerCanvasBuffer(0);
    await expect(buffer).toMatchSnapshot(["tool-brush.png"]);
  });
});

